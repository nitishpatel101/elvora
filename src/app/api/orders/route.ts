import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const admin = searchParams.get('admin');

    const orders = await getAllOrders();

    if (admin === 'true') {
      return NextResponse.json(orders);
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required to retrieve customer orders' },
        { status: 400 }
      );
    }

    const customerOrders = orders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json(customerOrders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve orders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
