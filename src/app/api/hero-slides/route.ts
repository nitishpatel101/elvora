import { NextResponse } from 'next/server';
import { getHeroSlides, saveHeroSlides } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json(slides, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read hero slides' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const updatedSlides = await req.json();
    if (!Array.isArray(updatedSlides)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    const saved = await saveHeroSlides(updatedSlides);
    return NextResponse.json({ success: true, slides: saved }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update hero slides' }, { status: 500 });
  }
}
