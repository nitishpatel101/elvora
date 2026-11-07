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

    if (!screenshotUrl && !utr) {
      return NextResponse.json(
        { error: 'Please upload your payment screenshot to verify payment.' },
        { status: 400 }
      );
    }

    if (screenshotUrl && typeof screenshotUrl === 'string') {
      order.upiScreenshot = screenshotUrl.trim();
    }

    if (utr && utr.trim()) {
      order.upiUtr = utr.trim().replace(/\s+/g, '');
    } else if (!order.upiUtr) {
      order.upiUtr = 'SCREENSHOT_ATTACHED';
    }

    order.status = 'PAYMENT_SUBMITTED';
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

