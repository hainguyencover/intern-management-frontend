import * as dashboardService from './dashboardService';
import { dashboardCache } from './dashboardCache';
import type { DashboardDataDto } from '../models/dashboard';

export class DashboardFacade {
  static async loadDashboardData(
    period: 'week' | 'month' | 'quarter' = 'month',
    forceRefresh = false
  ): Promise<DashboardDataDto> {
    const cacheKey = `dashboard_stats_${period}`;

    if (!forceRefresh) {
      const cached = dashboardCache.get<DashboardDataDto>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const data = await dashboardService.fetchDashboardData(period);
      dashboardCache.set(cacheKey, data);
      return data;
    } catch (error) {
      // If network fails, return cached copy if available even if expired
      const stale = dashboardCache.get<DashboardDataDto>(cacheKey);
      if (stale) return stale;
      throw error;
    }
  }

  static invalidateCache(): void {
    dashboardCache.clear();
  }
}
