export interface CacheEntry<T = any> {
  data: T;
  updatedAt: number;
  staleTime: number;
}

export class QueryCache {
  private cache = new Map<string, CacheEntry>();

  private normalizeKey(key: string | (string | number | object)[]): string {
    if (typeof key === 'string') return key;
    return JSON.stringify(key);
  }

  set<T>(key: string | (string | number | object)[], data: T, staleTime = 300000): void {
    const normalizedKey = this.normalizeKey(key);
    this.cache.set(normalizedKey, {
      data,
      updatedAt: Date.now(),
      staleTime
    });
  }

  get<T>(key: string | (string | number | object)[]): CacheEntry<T> | undefined {
    const normalizedKey = this.normalizeKey(key);
    return this.cache.get(normalizedKey) as CacheEntry<T> | undefined;
  }

  isStale(key: string | (string | number | object)[]): boolean {
    const entry = this.get(key);
    if (!entry) return true;
    return Date.now() - entry.updatedAt > entry.staleTime;
  }

  invalidateQueries(keyPrefix: string): void {
    for (const k of this.cache.keys()) {
      if (k.startsWith(keyPrefix) || k.includes(keyPrefix)) {
        this.cache.delete(k);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const globalQueryCache = new QueryCache();
