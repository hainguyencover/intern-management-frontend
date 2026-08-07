import { apiClient } from '../../../shared/api/client';
import type { DashboardKpi, RecentActivity, DashboardDataDto } from '../models/dashboard';

export async function fetchKpis(period: 'week' | 'month' | 'quarter' = 'month'): Promise<DashboardKpi[]> {
  const response = await apiClient.get<DashboardKpi[]>('/api/v1/dashboard/kpis', {
    params: { period }
  });
  return response.data;
}

export async function fetchActivities(): Promise<RecentActivity[]> {
  const response = await apiClient.get<RecentActivity[]>('/api/v1/dashboard/activities');
  return response.data;
}

export async function fetchDashboardData(period: 'week' | 'month' | 'quarter' = 'month'): Promise<DashboardDataDto> {
  const response = await apiClient.get<DashboardDataDto>('/api/v1/dashboard/stats', {
    params: { period }
  });
  return response.data;
}
