export interface DashboardKpi {
  id: string;
  title: string;
  value: number | string;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface RecentActivity {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface DashboardDataDto {
  kpis: DashboardKpi[];
  activities: RecentActivity[];
}
