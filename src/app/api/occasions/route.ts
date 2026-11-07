import { NextResponse } from 'next/server';
import { getOccasions, saveOccasions } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const occasions = await getOccasions();
    return NextResponse.json(occasions, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read occasions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const updated = await req.json();
    if (!Array.isArray(updated)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    const saved = await saveOccasions(updated);
    return NextResponse.json({ success: true, occasions: saved }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update occasions' }, { status: 500 });
  }
}
