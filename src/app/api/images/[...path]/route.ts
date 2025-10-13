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

// ✅ 이미지가 존재하는 두 개의 기본 디렉토리
const ROOT_DIR = process.cwd();
const BLOG_DIR = path.join(ROOT_DIR, "data", "blog");
const CRAFT_DIR = path.join(ROOT_DIR, "data", "craft", "img");

export async function GET(_: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const relPath = params.path.join("/");

    // 1️⃣ blog 디렉토리 확인
    const blogPath = path.join(BLOG_DIR, relPath);
    // 2️⃣ craft 디렉토리 확인
    const craftPath = path.join(CRAFT_DIR, relPath);

    let filePath: string | null = null;

    try {
      await fs.access(blogPath);
      filePath = blogPath;
    } catch {
      try {
        await fs.access(craftPath);
        filePath = craftPath;
      } catch {
        filePath = null;
      }
    }

    if (!filePath) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // ✅ 보안 검사: 루트 벗어난 접근 방지
    if (!filePath.startsWith(BLOG_DIR) && !filePath.startsWith(CRAFT_DIR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeMap[ext] || "application/octet-stream";
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": mime,
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? "public, max-age=31536000, immutable"
            : "no-store",
      },
    });
  } catch (err) {
    console.error("Image API error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}