'use client';

import { useEffect } from 'react';
import { useImagePreload } from '@/lib/imageCache';

export function usePreloadBlogImages(content: string, thumbnail?: string) {
  const { preloadImages } = useImagePreload();

  useEffect(() => {
    // Extract image URLs from content
    const imageRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["'](.*?)["']/g;
    const urls: string[] = [];
    
    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      const url = match[1] || match[2];
      if (url && !url.startsWith('http')) {
        // Convert relative URLs to API URLs
        const apiUrl = url.startsWith('/') 
          ? `/api/images${url}`
          : `/api/images/${url.startsWith('./') ? url.substring(2) : url}`;
        urls.push(apiUrl);
      }
    }

    // Add thumbnail if present
    if (thumbnail) {
      urls.push(`/api/images${thumbnail}`);
    }

    // Preload all images
    if (urls.length > 0) {
      preloadImages(urls);
    }
  }, [content, thumbnail, preloadImages]);
}
