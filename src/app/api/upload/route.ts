import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Create uploads directory if not exists
      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Clean filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}_${safeName}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/images/uploads/${filename}`;
      return NextResponse.json({ url: publicUrl, success: true });
    } catch {
      // Serverless fallback (e.g. Vercel read-only filesystem without external bucket):
      // Return Data URI so the image displays instantly everywhere with 0 cost!
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ url: dataUri, success: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

