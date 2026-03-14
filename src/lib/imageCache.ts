'use client';

interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  etag?: string;
}

class ImageCache {
  private cache = new Map<string, CachedImage>();
  private readonly maxAge = 24 * 60 * 60 * 1000; // 24 hours
  private readonly maxCacheSize = 50 * 1024 * 1024; // 50MB

  private generateKey(url: string): string {
    return url;
  }

  private isExpired(item: CachedImage): boolean {
    return Date.now() - item.timestamp > this.maxAge;
  }

  private async getCacheSize(): Promise<number> {
    let totalSize = 0;
    for (const item of this.cache.values()) {
      totalSize += item.blob.size;
    }
    return totalSize;
  }

  private async cleanupExpired(): Promise<void> {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  private async enforceSizeLimit(): Promise<void> {
    await this.cleanupExpired();
    
    let currentSize = await this.getCacheSize();
    if (currentSize <= this.maxCacheSize) return;

    // Sort by timestamp (oldest first) and remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (const [key] of entries) {
      this.cache.delete(key);
      currentSize = await this.getCacheSize();
      if (currentSize <= this.maxCacheSize) break;
    }
  }

  async get(url: string): Promise<Blob | null> {
    const key = this.generateKey(url);
    const cached = this.cache.get(key);

    if (!cached || this.isExpired(cached)) {
      if (cached) this.cache.delete(key);
      return null;
    }

    return cached.blob;
  }

  async set(url: string, blob: Blob, etag?: string): Promise<void> {
    const key = this.generateKey(url);
    
    this.cache.set(key, {
      url,
      blob,
      timestamp: Date.now(),
      etag,
    });

    await this.enforceSizeLimit();
  }

  async preloadImage(url: string): Promise<void> {
    try {
      const cached = await this.get(url);
      if (cached) return;

      const response = await fetch(url);
      if (!response.ok) return;

      const blob = await response.blob();
      const etag = response.headers.get('etag') || undefined;
      
      await this.set(url, blob, etag);
    } catch (error) {
      console.warn('Failed to preload image:', url, error);
    }
  }

  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url));
    await Promise.allSettled(promises);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; itemCount: number; totalSize: number } {
    let totalSize = 0;
    for (const item of this.cache.values()) {
      totalSize += item.blob.size;
    }

    return {
      size: this.cache.size,
      itemCount: this.cache.size,
      totalSize,
    };
  }
}

// Singleton instance
export const imageCache = new ImageCache();

// Hook for preloading critical images
export function useImagePreload() {
  const preloadImages = async (urls: string[]) => {
    await imageCache.preloadImages(urls);
  };

  return { preloadImages };
}
