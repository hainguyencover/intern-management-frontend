import { defineStore } from 'pinia';
import type { DashboardKpi, RecentActivity } from '../models/dashboard';
import { DashboardFacade } from '../services/dashboardFacade';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    kpis: [] as DashboardKpi[],
    activities: [] as RecentActivity[],
    timeRange: 'month' as 'week' | 'month' | 'quarter',
    loading: false,
    error: null as string | null
  }),

  actions: {
    async loadDashboardData(period?: 'week' | 'month' | 'quarter', forceRefresh = false): Promise<void> {
      if (period) {
        this.timeRange = period;
      }
      this.loading = true;
      this.error = null;
      try {
        const data = await DashboardFacade.loadDashboardData(this.timeRange, forceRefresh);
        this.kpis = data.kpis;
        this.activities = data.activities;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải dữ liệu tổng quan.';
      } finally {
        this.loading = false;
      }
    },

    setTimeRange(range: 'week' | 'month' | 'quarter'): void {
      this.timeRange = range;
      this.loadDashboardData(range, true);
    }
  }
});
