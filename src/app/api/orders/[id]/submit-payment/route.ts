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

    const body = await req.json().catch(() => ({}));
    const { utr, screenshotUrl, status } = body as {
      utr?: string;
      screenshotUrl?: string;
      status?: string;
    };

    if (screenshotUrl && typeof screenshotUrl === 'string') {
      order.upiScreenshot = screenshotUrl.trim();
    }

    if (utr && utr.trim()) {
      order.upiUtr = utr.trim().replace(/\s+/g, '');
    } else if (!order.upiUtr) {
      order.upiUtr = '1-CLICK-UPI-PAID';
    }

    // Set to PAID or confirmed
    order.status = status === 'PAID' ? 'PAID' : 'PAYMENT_SUBMITTED';
    order.paymentSubmittedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      upiScreenshot: order.upiScreenshot,
      upiUtr: order.upiUtr,
      paymentSubmittedAt: order.paymentSubmittedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error submitting payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

