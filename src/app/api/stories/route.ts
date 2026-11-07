import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const storiesFilePath = path.join(process.cwd(), 'data', 'stories.json');

export async function GET() {
  try {
    if (!fs.existsSync(storiesFilePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(storiesFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read stories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const updatedStories = await req.json();
    if (!Array.isArray(updatedStories)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    fs.writeFileSync(storiesFilePath, JSON.stringify(updatedStories, null, 2), 'utf8');
    return NextResponse.json({ success: true, stories: updatedStories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stories' }, { status: 500 });
  }
}

