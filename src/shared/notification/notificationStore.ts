import { defineStore } from 'pinia';
import type { ToastItem, BannerItem } from './notificationTypes';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    toasts: [] as ToastItem[],
    history: [] as ToastItem[],
    banners: [] as BannerItem[]
  }),

  actions: {
    addToast(toast: ToastItem): void {
      // Deduplicate: Don't add identical toast within 2 seconds
      const exists = this.toasts.some((t) => t.message === toast.message && t.level === toast.level);
      if (exists) return;

      // Enforce max 5 visible toasts using FIFO queue eviction
      if (this.toasts.length >= 5) {
        this.toasts.shift();
      }

      this.toasts.push(toast);
      this.history.unshift(toast);

      // Auto dismiss after duration
      const duration = toast.duration || 4000;
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    },

    removeToast(id: string): void {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    setBanner(banner: BannerItem): void {
      this.banners = [banner];
    },

    clearBanner(id?: string): void {
      if (id) {
        this.banners = this.banners.filter((b) => b.id !== id);
      } else {
        this.banners = [];
      }
    }
  }
});
