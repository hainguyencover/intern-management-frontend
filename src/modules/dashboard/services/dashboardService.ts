import { apiClient } from '../../../shared/api/client';
import type { DashboardKpi, RecentActivity, DashboardDataDto } from '../models/dashboard';

const defaultKpis: DashboardKpi[] = [
  {
    id: 'total-interns',
    title: 'Tổng thực tập sinh',
    value: 24,
    changePercentage: 12,
    trend: 'up',
    icon: 'groups',
    color: 'primary'
  },
  {
    id: 'total-mentors',
    title: 'Tổng số Mentor',
    value: 8,
    changePercentage: 5,
    trend: 'up',
    icon: 'school',
    color: 'secondary'
  },
  {
    id: 'pending-apps',
    title: 'Đơn chờ phê duyệt',
    value: 5,
    changePercentage: -2,
    trend: 'down',
    icon: 'pending_actions',
    color: 'warning'
  },
  {
    id: 'completion-rate',
    title: 'Tỷ lệ hoàn thành Task',
    value: '94%',
    changePercentage: 8,
    trend: 'up',
    icon: 'task_alt',
    color: 'success'
  }
];

const defaultActivities: RecentActivity[] = [
  {
    id: 'act-1',
    user: 'System Admin',
    action: 'Đã khởi tạo hệ thống và sẵn sàng phiên làm việc',
    timestamp: 'Vừa xong',
    type: 'success'
  },
  {
    id: 'act-2',
    user: 'HoLaHo Bot',
    action: 'Đồng bộ danh mục phòng ban và vị trí thực tập',
    timestamp: '5 phút trước',
    type: 'info'
  }
];

export async function fetchDashboardData(
  period: 'week' | 'month' | 'quarter' = 'month'
): Promise<DashboardDataDto> {
  try {
    const response = await apiClient.get<any>('/api/v1/dashboard/overview', {
      params: { period }
    });

    const raw = response.data?.data || response.data || {};

    const kpis: DashboardKpi[] = [
      {
        id: 'total-interns',
        title: 'Tổng thực tập sinh',
        value: raw.totalInterns ?? 24,
        changePercentage: 12,
        trend: 'up',
        icon: 'groups',
        color: 'primary'
      },
      {
        id: 'total-mentors',
        title: 'Tổng số Mentor',
        value: raw.totalMentors ?? 8,
        changePercentage: 5,
        trend: 'up',
        icon: 'school',
        color: 'secondary'
      },
      {
        id: 'pending-apps',
        title: 'Đơn chờ phê duyệt',
        value: raw.pendingApplications ?? 5,
        changePercentage: -2,
        trend: 'down',
        icon: 'pending_actions',
        color: 'warning'
      },
      {
        id: 'completed-tasks',
        title: 'Task hoàn thành',
        value: raw.completedTasks ?? (raw.totalTasks ? `${raw.completedTasks}/${raw.totalTasks}` : '94%'),
        changePercentage: 8,
        trend: 'up',
        icon: 'task_alt',
        color: 'success'
      }
    ];

    const activities: RecentActivity[] = (raw.recentActivities || []).map((act: any, idx: number) => ({
      id: `act-${idx}`,
      user: act.userName || act.user || 'Hệ thống',
      action: act.description || act.action || 'Thao tác mới',
      timestamp: act.timestamp || 'Gần đây',
      type: (act.type as any) || 'info'
    }));

    return {
      kpis,
      activities: activities.length ? activities : defaultActivities
    };
  } catch (error) {
    console.warn('Dashboard Overview API fallback:', error);
    return {
      kpis: defaultKpis,
      activities: defaultActivities
    };
  }
}

