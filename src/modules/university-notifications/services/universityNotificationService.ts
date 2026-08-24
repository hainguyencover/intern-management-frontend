import apiClient from '@/services/api/apiClient';
import type {
  UniversityNotification,
  UniversityNotificationUnreadCount,
  UniversityNotificationPreference,
  UniversityNotificationPreferenceUpdate,
  PageResponse
} from '../types/notification.types';

export async function getUniversityNotifications(params?: {
  page?: number;
  size?: number;
  status?: string;
  type?: string;
}): Promise<PageResponse<UniversityNotification>> {
  const { data } = await apiClient.get('/university/notifications', { params });
  return data.data || data;
}

export async function getUniversityUnreadCount(): Promise<UniversityNotificationUnreadCount> {
  const { data } = await apiClient.get('/university/notifications/unread-count');
  return data.data || data;
}

export async function getUniversityNotificationDetail(id: number): Promise<UniversityNotification> {
  const { data } = await apiClient.get(`/university/notifications/${id}`);
  return data.data || data;
}

export async function markUniversityNotificationAsRead(id: number): Promise<UniversityNotification> {
  const { data } = await apiClient.patch(`/university/notifications/${id}/read`);
  return data.data || data;
}

export async function markAllUniversityNotificationsAsRead(): Promise<number> {
  const { data } = await apiClient.patch('/university/notifications/read-all');
  return data.data || data;
}

export async function getUniversityNotificationPreferences(): Promise<UniversityNotificationPreference> {
  const { data } = await apiClient.get('/university/notification-preferences');
  return data.data || data;
}

export async function updateUniversityNotificationPreferences(
  req: UniversityNotificationPreferenceUpdate
): Promise<UniversityNotificationPreference> {
  const { data } = await apiClient.put('/university/notification-preferences', req);
  return data.data || data;
}
