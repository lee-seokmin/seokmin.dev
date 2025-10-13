# SEOKMIN.DEV

개인 포트폴리오 및 블로그 사이트입니다. Next.js 15와 현대적인 웹 기술을 사용하여 개발되었으며, 깔끔하고 직관적인 사용자 경험을 제공합니다.

## ✨ 주요 기능

- **📝 블로그**: MDX 형식으로 작성된 기술 블로그 포스트
- **🚀 프로젝트 쇼케이스**: 개인 프로젝트 및 작업물 소개
- **🎨 모던 UI**: Tailwind CSS와 Radix UI를 활용한 아름다운 인터페이스
- **🌙 다크모드 지원**: next-themes를 통한 테마 전환 기능
- **📱 반응형 디자인**: 모든 디바이스에서 완벽한 경험 제공
- **⚡ 고성능**: Turbopack을 활용한 빠른 개발 환경

## 🛠️ 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Content**: MDX (블로그 포스트)
- **Animation**: OGL (3D 그래픽)
- **Deployment**: Vercel
- **Code Quality**: Biome (Linting & Formatting)

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm, yarn, pnpm, 또는 bun

### 설치 및 실행

```bash
# 의존성 설치
npm install
# 또는
yarn install
# 또는
pnpm install
# 또는
bun install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format
```

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API 라우트
│   ├── blog/           # 블로그 페이지
│   └── craft/          # 프로젝트 페이지
├── components/         # 재사용 컴포넌트
│   ├── blog/          # 블로그 관련 컴포넌트
│   ├── craft/         # 프로젝트 관련 컴포넌트
│   └── ui/            # 기본 UI 컴포넌트
├── lib/               # 유틸리티 함수
└── types/             # TypeScript 타입 정의

data/
├── blog/              # 블로그 포스트 데이터
└── craft/             # 프로젝트 데이터
```

## 🎯 주요 특징

### 블로그 시스템
- MDX 형식의 포스트 작성
- 카테고리 및 태그 분류
- 썸네일 이미지 지원
- 베스트 포스트 표시 기능

### 프로젝트 쇼케이스
- 개인 프로젝트 소개
- 기술 스택 표시
- 이미지 갤러리 지원

### 개발자 경험
- Turbopack을 통한 빠른 핫 리로드
- Biome을 통한 일관된 코드 스타일
- TypeScript로 타입 안전성 보장

## 🌐 배포

이 프로젝트는 Vercel에 최적화되어 있습니다. 간편한 배포를 위해 다음 단계를 따르세요:

1. [Vercel 계정](https://vercel.com) 생성
2. 프로젝트를 GitHub에 푸시
3. Vercel 대시보드에서 새 프로젝트 생성
4. 자동 배포 완료!

## 📄 라이선스

이 프로젝트는 [MIT](LICENSE) 라이선스를 사용합니다.

## 👨‍💻 개발자

**Seokmin** - 개발 및 디자인

---

💡 문의사항이 있으시면 언제든지 연락주세요!
