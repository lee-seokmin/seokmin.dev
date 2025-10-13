import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Maximum file size to serve (50MB to leave some buffer)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

function findImageFile(imagePath: string): string | null {
  const blogDir = path.join(process.cwd(), 'data', 'blog');
  const craftDir = path.join(process.cwd(), 'data', 'craft', 'img');

  // Remove 'data/blog/' or 'data/craft/img/' prefix if present to avoid duplication
  let cleanPath = imagePath;
  if (imagePath.startsWith('data/blog/')) {
    cleanPath = imagePath.substring('data/blog/'.length);
  } else if (imagePath.startsWith('data/craft/img/')) {
    cleanPath = imagePath.substring('data/craft/img/'.length);
  }

  // First try the exact path
  const exactPath = path.join(blogDir, cleanPath);
  if (fs.existsSync(exactPath)) {
    return exactPath;
  }

  const exactCraftPath = path.join(craftDir, cleanPath);
  if (fs.existsSync(exactCraftPath)) {
    return exactCraftPath;
  }

  // If not found and it's a simple filename, search in all subdirectories
  if (!cleanPath.includes('/') && cleanPath.includes('.')) {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mov', '.mp4'];

    function searchDirectories(dir: string): string | null {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory() && item !== '.DS_Store') {
          // Check if any file in this directory matches our image
          for (const ext of extensions) {
            const testPath = path.join(itemPath, cleanPath);
            if (fs.existsSync(testPath)) {
              return testPath;
            }
          }

          // Recursively search subdirectories
          const found = searchDirectories(itemPath);
          if (found) return found;
        }
      }

      return null;
    }

    return searchDirectories(blogDir) || searchDirectories(craftDir);
  }

  return null;
}

function getContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.mov':
      return 'video/quicktime';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = pathSegments.join('/');
    const fullPath = findImageFile(imagePath);

    console.log('Requested:', imagePath);
    console.log('Resolved to:', fullPath);

    if (!fullPath) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Security check - ensure the file is within the blog directory
    const blogDir = path.join(process.cwd(), 'data', 'blog');
    const craftDir = path.join(process.cwd(), 'data', 'craft', 'img');
    if (!fullPath.startsWith(blogDir) && !fullPath.startsWith(craftDir)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Check file size before reading
    const stats = fs.statSync(fullPath);
    if (stats.size > MAX_FILE_SIZE) {
      return new NextResponse('File too large', { status: 413 });
    }

    const ext = path.extname(fullPath);
    const contentType = getContentType(ext);

    // For smaller files, read into memory as before
    if (stats.size < 1024 * 1024) { // 1MB threshold for memory reading
      const fileBuffer = fs.readFileSync(fullPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // For larger files, use streaming
    const fileStream = fs.createReadStream(fullPath);

    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
