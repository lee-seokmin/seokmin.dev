'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { imageCache } from '@/lib/imageCache';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  onCacheHit?: () => void;
  onCacheMiss?: () => void;
}

export default function OptimizedImage({
  src,
  fallbackSrc,
  onCacheHit,
  onCacheMiss,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const cacheCheckedRef = useRef(false);

  useEffect(() => {
    const checkCache = async () => {
      if (cacheCheckedRef.current) return;
      cacheCheckedRef.current = true;

      try {
        const cachedBlob = await imageCache.get(src);
        
        if (cachedBlob) {
          // Create object URL from cached blob
          const objectUrl = URL.createObjectURL(cachedBlob);
          setImageSrc(objectUrl);
          onCacheHit?.();
          
          // Clean up object URL when component unmounts
          return () => URL.revokeObjectURL(objectUrl);
        } else {
          onCacheMiss?.();
          // Preload and cache for next time
          imageCache.preloadImage(src);
        }
      } catch (error) {
        console.warn('Cache check failed:', error);
      }
    };

    checkCache();
  }, [src, onCacheHit, onCacheMiss]);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
      )}
      <Image
        src={imageSrc}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
        className={`${props.className || ''} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
