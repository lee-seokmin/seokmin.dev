import type { NextConfig } from 'next';
import nextMDX from '@next/mdx';
import { headers } from 'next/headers';

const nextConfig: NextConfig = {
  // Enable React's Strict Mode for development
  reactStrictMode: true,
  
  // File extensions for pages
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Image optimization configuration
  images: {
    domains: [
      'localhost'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow API routes for image serving
    unoptimized: false,
  },

  // Enable MDX
  experimental: {
    mdxRs: true,
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable, s-maxage=31536000, stale-while-revalidate=86400',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configure rewrites
  async rewrites() {
    return [
      {
        source: '/blog/:file(.+\\.mp4)',
        destination: '/api/images/:file',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

// Configure MDX
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);