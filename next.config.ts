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
      'localhost',
      'seokmin.dev',
      'www.seokmin.dev',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow API routes for image serving
    unoptimized: false,
  },

  // Enable webpack 5
  webpack: (config, { isServer, dev }) => {
    // Exclude large static assets from serverless function bundle
    if (isServer && !dev) {
      config.externals = config.externals || [];
      config.externals.push({
        'public/data': 'commonjs public/data',
      });
    }
    return config;
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
    ];
  },

  // Configure rewrites
  async rewrites() {
    return [
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