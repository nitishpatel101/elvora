import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, verifiedBy = 'admin@elvora.com', notes } = body as {
      orderId?: string;
      verifiedBy?: string;
      notes?: string;
    };

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mark as PAID and CONFIRMED
    order.status = 'PAID';
    order.verifiedBy = verifiedBy;
    order.verifiedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    if (notes) {
      order.rejectionReason = undefined;
    }

    await saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      verifiedAt: order.verifiedAt,
      verifiedBy: order.verifiedBy,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error verifying payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

