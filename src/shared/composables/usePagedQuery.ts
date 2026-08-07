import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { PageResponse } from '../../modules/intern/models/intern';

export interface UsePagedQueryOptions<T> {
  fetcher: (params: { page: number; limit: number; search?: string; filter?: any }) => Promise<PageResponse<T>>;
  initialLimit?: number;
  syncUrl?: boolean;
}

export function usePagedQuery<T>(options: UsePagedQueryOptions<T>) {
  const route = useRoute();
  const router = useRouter();

  const items = ref<T[]>([]) as { value: T[] };
  const totalElements = ref(0);
  const totalPages = ref(1);
  const page = ref(options.syncUrl && route.query.page ? Number(route.query.page) : 1);
  const limit = ref(options.initialLimit || 10);
  const search = ref(options.syncUrl && route.query.search ? String(route.query.search) : '');
  const filter = ref<any>(options.syncUrl && route.query.status ? route.query.status : '');
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadData() {
    loading.value = true;
    error.value = null;
    try {
      const res = await options.fetcher({
        page: page.value,
        limit: limit.value,
        search: search.value || undefined,
        filter: filter.value || undefined
      });
      items.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
      page.value = res.page;
    } catch (err: any) {
      error.value = err?.message || 'Không thể tải dữ liệu.';
    } finally {
      loading.value = false;
    }
  }

  function syncUrlParams() {
    if (!options.syncUrl) return;
    const query: Record<string, any> = {};
    if (page.value > 1) query.page = page.value;
    if (search.value) query.search = search.value;
    if (filter.value) query.status = filter.value;
    router.replace({ query });
  }

  watch([page, search, filter], () => {
    syncUrlParams();
    loadData();
  });

  onMounted(() => {
    loadData();
  });

  return {
    items,
    totalElements,
    totalPages,
    page,
    limit,
    search,
    filter,
    loading,
    error,
    refresh: loadData,
    setPage: (p: number) => { page.value = p; },
    setSearch: (s: string) => { search.value = s; page.value = 1; },
    setFilter: (f: any) => { filter.value = f; page.value = 1; }
  };
}
