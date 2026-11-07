import { NextResponse } from 'next/server';
import { getProductById, saveOrder, getStoreSettings } from '@/lib/db';
import { createRazorpayOrder, isRazorpayLive, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { Order, OrderItem, ShippingAddress, Currency } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingAddress, currency = 'INR' } = body as {
      items: { productId: string; quantity: number; selectedVariant?: string; selectedColour?: string }[];
      shippingAddress: ShippingAddress;
      currency: Currency;
    };

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.pincode) {
      return NextResponse.json({ error: 'Complete delivery address is required' }, { status: 400 });
    }

    // Server-side Price Validation & Stock Validation
    let subtotalInr = 0;
    const validatedOrderItems: OrderItem[] = [];

    for (const item of items) {
      const dbProduct = await getProductById(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (!dbProduct.inStock || dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${dbProduct.name}` },
          { status: 400 }
        );
      }

      const itemTotal = dbProduct.price * item.quantity;
      subtotalInr += itemTotal;

      validatedOrderItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productImage: dbProduct.images[0] || '/images/products/touch-distance-bracelet/hero.jpg',
        priceAtPurchase: dbProduct.price, // Lock in price at purchase time
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        selectedColour: item.selectedColour,
      });
    }

    // Paid Shipping Calculation (Strictly paid, free shipping is prohibited)
    const isDomestic = shippingAddress.country?.toLowerCase() === 'india' || !shippingAddress.country;
    const shippingChargeInr = isDomestic ? 99 : 1299;
    const totalAmountInr = subtotalInr + shippingChargeInr;

    // Generate unique internal Order ID
    const uniqueOrderId = `ELV-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Razorpay / Gateway Order
    const gatewayOrder = await createRazorpayOrder({
      amountInInr: totalAmountInr,
      receipt: uniqueOrderId,
      currency: 'INR', // Indian payment gateway standard
    });

    const storeSettings = await getStoreSettings();

    // Create Initial Order Record with PAYMENT_PENDING status (Manual UPI QR Payment)
    const initialOrder: Order = {
      id: uniqueOrderId,
      customerEmail: shippingAddress.email,
      customerName: shippingAddress.fullName,
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: validatedOrderItems,
      subtotal: subtotalInr,
      shippingCharge: shippingChargeInr,
      discount: 0,
      totalAmount: totalAmountInr,
      currency,
      status: 'PAYMENT_PENDING',
      paymentMethod: (body.paymentMethod as 'ONLINE' | 'UPI_QR') || 'UPI_QR',
      paymentGateway: (body.paymentGateway as 'RAZORPAY' | 'MANUAL_UPI') || 'MANUAL_UPI',
      razorpayOrderId: gatewayOrder.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveOrder(initialOrder);

    return NextResponse.json({
      orderId: uniqueOrderId,
      gatewayOrderId: gatewayOrder.id,
      amount: gatewayOrder.amount, // paise
      amountInr: totalAmountInr,
      subtotalInr,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      isLiveGateway: isRazorpayLive,
      shippingCharge: shippingChargeInr,
      paymentMethod: 'UPI_QR',
      upiId: storeSettings.upiId,
      payeeName: storeSettings.payeeName,
      upiQrImage: storeSettings.upiQrImage,
      customer: {
        name: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create payment order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

