import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function findImageFile(imagePath: string): string | null {
  const blogDir = path.join(process.cwd(), 'public', 'data', 'blog');
  const craftDir = path.join(process.cwd(), 'public', 'data', 'craft', 'img');

  // Remove 'data/blog/' or 'data/craft/img/' prefix if present to avoid duplication
  let cleanPath = imagePath;
  if (imagePath.startsWith('public/data/blog/')) {
    cleanPath = imagePath.substring('public/data/blog/'.length);
  } else if (imagePath.startsWith('public/data/craft/img/')) {
    cleanPath = imagePath.substring('public/data/craft/img/'.length);
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
    const blogDir = path.join(process.cwd(), 'public', 'data', 'blog');
    const craftDir = path.join(process.cwd(), 'public', 'data', 'craft', 'img');
    if (!fullPath.startsWith(blogDir) && !fullPath.startsWith(craftDir)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);

    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.mov':
        contentType = 'video/quicktime';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
