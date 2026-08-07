import { ref, computed, watch, onMounted } from 'vue';
import { globalQueryCache } from './queryCache';

export interface QueryOptions<TData> {
  queryKey: string | (string | number | object)[];
  queryFn: () => Promise<TData>;
  staleTime?: number;
  retry?: number;
  enabled?: boolean;
}

export function useQuery<TData>(options: QueryOptions<TData>) {
  const data = ref<TData | null>(null) as { value: TData | null };
  const loading = ref(false);
  const error = ref<any>(null);

  const isStale = computed(() => {
    return globalQueryCache.isStale(options.queryKey);
  });

  async function fetchWithRetry(attempt = 0): Promise<TData> {
    try {
      return await options.queryFn();
    } catch (err) {
      const maxRetries = options.retry !== undefined ? options.retry : 1;
      if (attempt < maxRetries) {
        return await fetchWithRetry(attempt + 1);
      }
      throw err;
    }
  }

  async function refetch() {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchWithRetry();
      data.value = result;
      globalQueryCache.set(options.queryKey, result, options.staleTime);
    } catch (err: any) {
      error.value = err?.message || 'Lỗi truy vấn dữ liệu.';
    } finally {
      loading.value = false;
    }
  }

  async function execute() {
    if (options.enabled === false) return;

    // Check cache
    const cached = globalQueryCache.get<TData>(options.queryKey);
    if (cached && !globalQueryCache.isStale(options.queryKey)) {
      data.value = cached.data;
      loading.value = false;
      return;
    }

    if (cached) {
      data.value = cached.data; // serve stale data while revalidating in background
    }

    await refetch();
  }

  watch(() => options.queryKey, () => {
    execute();
  }, { deep: true });

  onMounted(() => {
    execute();
  });

  return {
    data,
    loading,
    error,
    isStale,
    refetch
  };
}
