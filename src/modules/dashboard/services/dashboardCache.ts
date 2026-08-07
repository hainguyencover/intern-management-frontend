interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class DashboardCache {
  private cache = new Map<string, CacheEntry<any>>();
  private DEFAULT_TTL_MS = 30 * 1000; // 30 seconds

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    const expiry = Date.now() + (ttlMs ?? this.DEFAULT_TTL_MS);
    this.cache.set(key, { data, expiry });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const dashboardCache = new DashboardCache();
