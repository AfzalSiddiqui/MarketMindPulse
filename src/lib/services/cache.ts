// Server-side in-memory TTL cache

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiry: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// Singleton cache instance
const globalCache = new TTLCache();

// TTL constants (ms)
export const CACHE_TTL = {
  STOCKS: 8000,
  INDICES: 8000,
  SECTORS: 15000,
  CHART: 30000,
  STOCK_LIST: 3600000, // 1 hour
} as const;

export default globalCache;
