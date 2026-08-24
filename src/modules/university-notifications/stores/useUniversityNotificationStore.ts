import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  UniversityNotification,
  UniversityNotificationPreference,
  UniversityNotificationPreferenceUpdate
} from '../types/notification.types';
import {
  getUniversityNotifications,
  getUniversityUnreadCount,
  markUniversityNotificationAsRead,
  markAllUniversityNotificationsAsRead,
  getUniversityNotificationPreferences,
  updateUniversityNotificationPreferences
} from '../services/universityNotificationService';

export const useUniversityNotificationStore = defineStore('universityNotification', () => {
  const items = ref<UniversityNotification[]>([]);
  const unreadCount = ref<number>(0);
  const loading = ref<boolean>(false);
  const page = ref<number>(0);
  const size = ref<number>(10);
  const totalElements = ref<number>(0);
  const totalPages = ref<number>(1);
  const filterStatus = ref<string>('');
  const filterType = ref<string>('');
  const preference = ref<UniversityNotificationPreference | null>(null);

  async function fetchNotifications(resetPage = false) {
    if (resetPage) {
      page.value = 0;
    }
    loading.value = true;
    try {
      const res = await getUniversityNotifications({
        page: page.value,
        size: size.value,
        status: filterStatus.value || undefined,
        type: filterType.value || undefined
      });
      items.value = res.content || [];
      totalElements.value = res.totalElements || 0;
      totalPages.value = res.totalPages || 1;
    } catch (err) {
      console.error('Failed to fetch university notifications', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const res = await getUniversityUnreadCount();
      unreadCount.value = res.count || 0;
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  }

  async function markAsRead(id: number) {
    try {
      await markUniversityNotificationAsRead(id);
      const target = items.value.find((item) => item.id === id);
      if (target && target.status === 'UNREAD') {
        target.status = 'READ';
        target.readAt = new Date().toISOString();
        if (unreadCount.value > 0) {
          unreadCount.value--;
        }
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }

  async function markAllAsRead() {
    try {
      await markAllUniversityNotificationsAsRead();
      items.value.forEach((item) => {
        item.status = 'READ';
      });
      unreadCount.value = 0;
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  }

  async function fetchPreferences() {
    try {
      preference.value = await getUniversityNotificationPreferences();
    } catch (err) {
      console.error('Failed to fetch notification preferences', err);
    }
  }

  async function updatePreferences(req: UniversityNotificationPreferenceUpdate) {
    try {
      preference.value = await updateUniversityNotificationPreferences(req);
    } catch (err) {
      console.error('Failed to update notification preferences', err);
    }
  }

  return {
    items,
    unreadCount,
    loading,
    page,
    size,
    totalElements,
    totalPages,
    filterStatus,
    filterType,
    preference,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    fetchPreferences,
    updatePreferences
  };
});
