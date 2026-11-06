import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { getAllOrders, saveOrder } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature({
        body: rawBody,
        signature,
        webhookSecret,
      });

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const orders = await getAllOrders();
        const matched = orders.find((o) => o.razorpayOrderId === razorpayOrderId);

        if (matched && matched.status !== 'PAID') {
          matched.status = 'PAID';
          matched.paymentId = paymentId;
          matched.updatedAt = new Date().toISOString();
          await saveOrder(matched);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

