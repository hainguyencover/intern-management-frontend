import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '../store/dashboardStore';

export function useDashboard() {
  const store = useDashboardStore();
  const { kpis, activities, timeRange, loading, error } = storeToRefs(store);

  onMounted(() => {
    store.loadDashboardData();
  });

  function changeTimeRange(range: 'week' | 'month' | 'quarter') {
    store.setTimeRange(range);
  }

  function refresh() {
    store.loadDashboardData();
  }

  return {
    kpis,
    activities,
    timeRange,
    loading,
    error,
    changeTimeRange,
    refresh
  };
}
