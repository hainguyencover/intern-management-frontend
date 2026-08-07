export type ToastLevel = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  level: ToastLevel;
  timestamp: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  color?: 'primary' | 'negative' | 'warning';
}

export interface BannerItem {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  dismissible?: boolean;
}
