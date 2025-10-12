import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = pathSegments.join('/');
    const fullPath = path.join(process.cwd(), 'data', 'blog', imagePath);

    if (!fullPath.startsWith(path.join(process.cwd(), 'data', 'blog'))) {
      return new NextResponse('Not Found', { status: 404 });
    }
    if (!fs.existsSync(fullPath)) {
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
