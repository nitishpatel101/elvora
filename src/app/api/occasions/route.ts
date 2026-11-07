import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const occasionsFilePath = path.join(process.cwd(), 'data', 'occasions.json');

export async function GET() {
  try {
    if (!fs.existsSync(occasionsFilePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(occasionsFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
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
    fs.writeFileSync(occasionsFilePath, JSON.stringify(updated, null, 2), 'utf8');
    return NextResponse.json({ success: true, occasions: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update occasions' }, { status: 500 });
  }
}

