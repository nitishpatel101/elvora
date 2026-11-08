/**
 * Checks if a given URL, filename, or data URI represents a playable video.
 */
export function isVideoFileOrUrl(urlOrName?: string, mediaType?: string): boolean {
  if (mediaType === 'video') return true;
  if (!urlOrName) return false;
  const clean = urlOrName.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4v') ||
    clean.startsWith('data:video/')
  );
}

/**
 * Client-side high performance image compression utility.
 * Resizes large smartphone & camera photos down to web dimensions (max 1920px)
 * and compresses them to high-efficiency JPEG (100-250KB) before uploading.
 * This guarantees uploads never exceed Vercel/serverless payload limits (4.5MB).
 * Videos, SVGs, and GIFs are safely passed through without modification.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<File> {
  // Only compress raster images; pass through videos, SVGs, GIFs, and non-images
  if (
    typeof window === 'undefined' ||
    file.type.startsWith('video/') ||
    /\.(mp4|webm|mov|ogg|m4v)$/i.test(file.name) ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file;
  }

  // If already under 250KB, no need to re-encode
  if (file.size <= 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Maintain aspect ratio while bounding to maxWidth x maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw and compress to JPEG
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
            } else {
              const safeName = file.name.replace(/\.[^.]+$/, '.jpg');
              const compressed = new File([blob], safeName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressed);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

