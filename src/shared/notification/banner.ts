import { useNotificationStore } from './notificationStore';

export const banner = {
  show(message: string, type: 'info' | 'warning' | 'error' = 'info', dismissible = true): string {
    const store = useNotificationStore();
    const id = 'bnr-' + Date.now();
    store.setBanner({ id, type, message, dismissible });
    return id;
  },

  clear(id?: string): void {
    const store = useNotificationStore();
    store.clearBanner(id);
  }
};
