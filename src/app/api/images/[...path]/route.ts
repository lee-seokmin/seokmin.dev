import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// ✅ 지원 파일 확장자 → 필요시 추가 가능
const mimeMap: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
};

// ✅ 이미지가 존재하는 기본 디렉토리 (배포 환경에서는 public 디렉토리만 사용)
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_BLOG_DIR = path.join(ROOT_DIR, "data", "blog");
const DATA_CRAFT_DIR = path.join(ROOT_DIR, "data", "craft", "img");

export async function GET(_: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await params;
    const relPath = pathSegments.join("/");

    // 디렉토리 우선순위 결정 (환경에 따라)
    const isProduction = (process.env.NODE_ENV as string) === "production";

    let filePath: string | null = null;

    // 개발 환경에서는 data 디렉토리부터 직접 확인
    if (!isProduction) {
      // 요청 경로가 data/blog로 시작하면 data/blog 디렉토리 확인
      if (relPath.startsWith('data/blog/')) {
        const dataBlogPath = path.join(ROOT_DIR, relPath);
        try {
          await fs.access(dataBlogPath);
          filePath = dataBlogPath;
        } catch {
          filePath = null;
        }
      }
      // 요청 경로가 data/craft로 시작하면 data/craft 디렉토리 확인
      else if (relPath.startsWith('data/craft/')) {
        const dataCraftPath = path.join(ROOT_DIR, relPath);
        try {
          await fs.access(dataCraftPath);
          filePath = dataCraftPath;
        } catch {
          filePath = null;
        }
      }
      // 그 외의 경우는 public 디렉토리 확인
      else {
        const publicPath = path.join(PUBLIC_DIR, relPath);
        try {
          await fs.access(publicPath);
          filePath = publicPath;
        } catch {
          filePath = null;
        }
      }
    }
    // 배포 환경에서는 public 디렉토리 우선 확인
    else {
      const publicPath = path.join(PUBLIC_DIR, relPath);
      try {
        await fs.access(publicPath);
        filePath = publicPath;
      } catch {
        filePath = null;
      }
    }

    if (!filePath) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // ✅ 보안 검사: 루트 벗어난 접근 방지
    if (!filePath.startsWith(PUBLIC_DIR) && !filePath.startsWith(DATA_BLOG_DIR) && !filePath.startsWith(DATA_CRAFT_DIR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeMap[ext] || "application/octet-stream";
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer as any, {
      headers: {
        "Content-Type": mime,
        "Cache-Control":
          isProduction
            ? "public, max-age=31536000, immutable"
            : "no-store",
      },
    });
  } catch (err) {
    console.error("Image API error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}