import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const slidesFilePath = path.join(process.cwd(), 'data', 'hero_slides.json');

export async function GET() {
  try {
    if (!fs.existsSync(slidesFilePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(slidesFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
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
    fs.writeFileSync(slidesFilePath, JSON.stringify(updatedSlides, null, 2), 'utf8');
    return NextResponse.json({ success: true, slides: updatedSlides });
  } catch {
    return NextResponse.json({ error: 'Failed to update hero slides' }, { status: 500 });
  }
}

