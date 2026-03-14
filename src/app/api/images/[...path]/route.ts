import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Maximum file size to serve (50MB to leave some buffer)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Cache duration: 1 year for static images (immutable)
const CACHE_MAX_AGE = 31536000; // 1 year in seconds
const STALE_WHILE_REVALIDATE = 86400; // 1 day in seconds

function generateETag(fileBuffer: Buffer | string): string {
  const hash = crypto.createHash('md5');
  hash.update(typeof fileBuffer === 'string' ? fileBuffer : fileBuffer);
  return `"${hash.digest('hex')}"`;
}

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
    const lastModified = stats.mtime.toUTCString();
    
    // Read file for ETag generation
    const fileBuffer = fs.readFileSync(fullPath);
    const etag = generateETag(fileBuffer);

    // Check conditional headers
    const ifNoneMatch = request.headers.get('if-none-match');
    const ifModifiedSince = request.headers.get('if-modified-since');

    // Return 304 Not Modified if the file hasn't changed
    if (ifNoneMatch === etag || (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Last-Modified': lastModified,
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'Vary': 'Accept-Encoding',
        },
      });
    }

    // For smaller files, read into memory
    if (stats.size < 1024 * 1024) { // 1MB threshold
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': stats.size.toString(),
          'ETag': etag,
          'Last-Modified': lastModified,
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'Vary': 'Accept-Encoding',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // For larger files, use streaming
    const fileStream = fs.createReadStream(fullPath);

    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'ETag': etag,
        'Last-Modified': lastModified,
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
        'Vary': 'Accept-Encoding',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
