import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadCloudMedia } from '@/lib/cloudStore';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify it's an image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg|m4v)$/i.test(file.name);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'File must be an image or video (MP4, WebM, MOV)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try uploading to GitHub data-store branch CDN (works across all serverless instances)
    const cloudUrl = await uploadCloudMedia(file.name, buffer);
    if (cloudUrl) {
      // Also try writing to local disk if writable
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        await fs.writeFile(path.join(uploadsDir, `${Date.now()}_${safeName}`), buffer);
      } catch {}

      return NextResponse.json({ url: cloudUrl, success: true });
    }

    // 2. Fallback to local uploads directory (for local development)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}_${safeName}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/images/uploads/${filename}`;
      return NextResponse.json({ url: publicUrl, success: true });
    } catch {
      // 3. Last-resort fallback: Data URI
      const base64 = buffer.toString('base64');
      const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');
      const dataUri = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ url: dataUri, success: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
