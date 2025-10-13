const fs = require('fs');
const path = require('path');

// 필요한 이미지를 public/images로 복사하는 스크립트
async function copyImages() {
  const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
  const dataBlogDir = path.join(__dirname, '..', 'data', 'blog');
  const dataCraftDir = path.join(__dirname, '..', 'data', 'craft', 'img');

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  // 이미지 파일 확장자
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  // 실제로 존재하는 이미지 파일들만 복사
  function copyExistingImages(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;

    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
      const srcPath = path.join(srcDir, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        // 재귀적으로 서브디렉토리 탐색
        const destSubDir = path.join(destDir, item);
        if (!fs.existsSync(destSubDir)) {
          fs.mkdirSync(destSubDir, { recursive: true });
        }
        copyExistingImages(srcPath, destSubDir);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          const destPath = path.join(destDir, item);

          // 같은 파일이 이미 있으면 건너뜀
          if (fs.existsSync(destPath)) {
            console.log(`Skipping existing file: ${item}`);
            return;
          }

          // 파일 크기 확인 (5MB 이상이면 건너뜀 - Vercel 제한 고려)
          if (stat.size > 5 * 1024 * 1024) {
            console.log(`Skipping large file: ${item} (${(stat.size / 1024 / 1024).toFixed(2)}MB)`);
            return;
          }

          try {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${item} (${(stat.size / 1024).toFixed(2)}KB)`);
          } catch (error) {
            console.error(`Error copying ${item}:`, error.message);
          }
        }
      }
    });
  }

  console.log('Copying blog images...');
  copyExistingImages(dataBlogDir, publicImagesDir);

  console.log('Copying craft images...');
  copyExistingImages(dataCraftDir, path.join(publicImagesDir, 'data', 'craft'));
}

copyImages().catch(console.error);
