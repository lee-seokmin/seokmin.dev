'use client';

import { useEffect } from 'react';
import { usePreloadBlogImages } from '@/hooks/usePreloadBlogImages';
import MDXContent from './MDXContent';

interface BlogContentWrapperProps {
  mdxSource: any;
  content: string;
  thumbnail?: string;
}

export default function BlogContentWrapper({
  mdxSource,
  content,
  thumbnail,
}: BlogContentWrapperProps) {
  // Preload all images in the content
  usePreloadBlogImages(content, thumbnail);

  return <MDXContent mdxSource={mdxSource} />;
}
