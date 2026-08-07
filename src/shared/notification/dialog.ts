import type { ConfirmDialogOptions } from './notificationTypes';

export const dialog = {
  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const result = window.confirm(`${options.title}\n\n${options.message}`);
      resolve(result);
    });
  }
};
