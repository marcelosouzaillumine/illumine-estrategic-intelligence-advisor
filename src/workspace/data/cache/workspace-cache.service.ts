export type CacheCategory = 'memory' | 'persistent' | 'session';

export interface CacheOptions {
  category: CacheCategory;
  ttl?: number; // Time to live in seconds
  staleWhileRevalidate?: boolean;
}

export class WorkspaceCacheService {
  private static memoryCache = new Map<string, any>();

  static async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) as T;
    }
    return null;
  }

  static async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    this.memoryCache.set(key, value);
  }

  static invalidateCache(keyPattern: string): void {
    // Invalidate everything for now (placeholder)
    this.memoryCache.clear();
  }
}
