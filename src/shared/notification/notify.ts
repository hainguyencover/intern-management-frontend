import { NotificationCenter } from './notificationCenter';
import type { ToastOptions } from './notificationTypes';

export const notify = {
  success(options: string | ToastOptions): string {
    return NotificationCenter.notify('success', options);
  },

  error(options: string | ToastOptions): string {
    return NotificationCenter.notify('error', options);
  },

  info(options: string | ToastOptions): string {
    return NotificationCenter.notify('info', options);
  },

  warning(options: string | ToastOptions): string {
    return NotificationCenter.notify('warning', options);
  },

  async promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ): Promise<T> {
    const toastId = NotificationCenter.notify('info', { message: messages.loading, duration: 10000 });
    try {
      const result = await promise;
      NotificationCenter.notify('success', { message: messages.success });
      return result;
    } catch (err: any) {
      NotificationCenter.notify('error', { message: err?.message || messages.error });
      throw err;
    }
  },

  progress(message: string, percent: number): string {
    return NotificationCenter.notify('info', { message: `${message} (${percent}%)` });
  }
};
