import { NextResponse } from 'next/server';
import { getOrderById, saveOrder, getProductById, saveProduct } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory payment verification signatures' },
        { status: 400 }
      );
    }

    // 1. Fetch Order from DB
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found in records' },
        { status: 404 }
      );
    }

    // 2. Prevent Duplicate Order Processing (Idempotency)
    if (order.status === 'PAID' && order.paymentId === razorpayPaymentId) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        orderId: order.id,
        message: 'Order was already verified and confirmed as PAID',
      });
    }

    // 3. Cryptographic Signature Verification
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      // Mark as failed/pending, DO NOT confirm order
      console.error(`Fraudulent or mismatched signature detected for Order ${orderId}`);
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Order will not be confirmed.' },
        { status: 403 }
      );
    }

    // 4. Update Order Status to PAID and Record Payment Reference
    order.status = 'PAID';
    order.paymentId = razorpayPaymentId;
    order.razorpayOrderId = razorpayOrderId;
    order.updatedAt = new Date().toISOString();

    // 5. Deduct Inventory Stock Safely
    for (const item of order.items) {
      try {
        const prod = await getProductById(item.productId);
        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await saveProduct({
            ...prod,
            stock: newStock,
            inStock: newStock > 0,
          });
        }
      } catch (err) {
        console.warn(`Could not deduct stock for ${item.productId}:`, err);
      }
    }

    await saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      paymentId: razorpayPaymentId,
      totalAmount: order.totalAmount,
      currency: order.currency,
      message: 'Payment verified successfully. Order confirmed.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error verifying payment';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
