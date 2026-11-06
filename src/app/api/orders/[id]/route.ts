import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await req.json();

    if (body.status) order.status = body.status;
    if (body.trackingNumber) order.trackingNumber = body.trackingNumber;
    if (body.trackingCourier) order.trackingCourier = body.trackingCourier;
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

