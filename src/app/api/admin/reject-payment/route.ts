import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, reason = 'Bank credit not received or UTR mismatch' } = body as {
      orderId?: string;
      reason?: string;
    };

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = 'PAYMENT_REJECTED';
    order.rejectionReason = reason;
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      rejectionReason: order.rejectionReason,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error rejecting payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

