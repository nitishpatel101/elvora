import { NextResponse } from 'next/server';
import { getStories, saveStories } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json(stories, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read stories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const updatedStories = await req.json();
    if (!Array.isArray(updatedStories)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    const saved = await saveStories(updatedStories);
    return NextResponse.json({ success: true, stories: saved }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update stories' }, { status: 500 });
  }
}
