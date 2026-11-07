import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'PAID' || order.status === 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Order is already paid and verified' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { utr, screenshotUrl } = body as { utr?: string; screenshotUrl?: string };

    if (!utr || !utr.trim()) {
      return NextResponse.json(
        { error: 'UPI transaction reference number (UTR) is required' },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().replace(/\s+/g, '');
    if (cleanUtr.length < 6 || cleanUtr.length > 40) {
      return NextResponse.json(
        { error: 'Invalid UPI reference number (UTR). Please enter a valid reference.' },
        { status: 400 }
      );
    }

    order.upiUtr = cleanUtr;
    if (screenshotUrl && typeof screenshotUrl === 'string') {
      order.upiScreenshot = screenshotUrl.trim();
    }
    order.status = 'PAYMENT_SUBMITTED';
    order.paymentSubmittedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      upiUtr: order.upiUtr,
      paymentSubmittedAt: order.paymentSubmittedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error submitting payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

