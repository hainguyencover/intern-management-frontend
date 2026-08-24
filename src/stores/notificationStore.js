import { defineStore } from 'pinia';
import { notificationApi } from '@/api/notificationApi';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        unreadCount: 0,
        loading: false,
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        preferences: [],
    }),

    actions: {
        async fetchNotifications(statusFilter = null) {
            this.loading = true;
            try {
                const params = {
                    page: this.page,
                    size: this.size,
                };
                if (statusFilter) {
                    params.status = statusFilter;
                }
                const res = await notificationApi.getAll(params);
                const pageData = res.data?.data || res.data || {};
                this.notifications = pageData.content || [];
                this.totalElements = pageData.totalElements || 0;
                this.totalPages = pageData.totalPages || 0;
            } catch (err) {
                console.error('Error fetching notifications:', err);
            } finally {
                this.loading = false;
            }
        },

        async fetchUnreadCount() {
            try {
                const res = await notificationApi.getUnreadCount();
                const data = res.data?.data || res.data || {};
                this.unreadCount = data.count !== undefined ? data.count : (typeof data === 'number' ? data : 0);
            } catch (err) {
                console.error('Error fetching unread count:', err);
            }
        },

        async markAsRead(id) {
            try {
                await notificationApi.markAsRead(id);
                const item = this.notifications.find(n => n.id === id);
                if (item && item.status === 'UNREAD') {
                    item.status = 'READ';
                    if (this.unreadCount > 0) {
                        this.unreadCount--;
                    }
                }
            } catch (err) {
                console.error(`Error marking notification ${id} as read:`, err);
            }
        },

        async markAllAsRead() {
            try {
                await notificationApi.markAllAsRead();
                this.notifications.forEach(n => {
                    n.status = 'READ';
                });
                this.unreadCount = 0;
            } catch (err) {
                console.error('Error marking all notifications as read:', err);
            }
        },

        async deleteNotification(id) {
            try {
                await notificationApi.deleteNotification(id);
                const item = this.notifications.find(n => n.id === id);
                if (item && item.status === 'UNREAD' && this.unreadCount > 0) {
                    this.unreadCount--;
                }
                this.notifications = this.notifications.filter(n => n.id !== id);
                this.totalElements = Math.max(0, this.totalElements - 1);
            } catch (err) {
                console.error(`Error deleting notification ${id}:`, err);
            }
        },

        async fetchPreferences() {
            try {
                const res = await notificationApi.getPreferences();
                this.preferences = res.data?.data || res.data || [];
            } catch (err) {
                console.error('Error fetching preferences:', err);
            }
        },

        async updatePreference(reqData) {
            try {
                await notificationApi.updatePreference(reqData);
                await this.fetchPreferences();
            } catch (err) {
                console.error('Error updating preference:', err);
            }
        },

        addRealtimeNotification(notification) {
            // Add to start of list
            this.notifications.unshift(notification);
            if (notification.status === 'UNREAD') {
                this.unreadCount++;
            }
        }
    }
});
