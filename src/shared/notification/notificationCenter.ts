import { useNotificationStore } from './notificationStore';
import type { ToastLevel, ToastOptions, ToastItem } from './notificationTypes';

export class NotificationCenter {
  static notify(level: ToastLevel, options: string | ToastOptions): string {
    const store = useNotificationStore();
    const id = 'ntf-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    
    const payload: ToastOptions = typeof options === 'string' ? { message: options } : options;
    
    const item: ToastItem = {
      id,
      level,
      message: payload.message,
      title: payload.title,
      duration: payload.duration,
      actionLabel: payload.actionLabel,
      onAction: payload.onAction,
      timestamp: new Date().toLocaleTimeString()
    };

    store.addToast(item);
    return id;
  }
}
