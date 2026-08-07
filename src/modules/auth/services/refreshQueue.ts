import type { InternalAxiosRequestConfig } from 'axios';

/**
 * RefreshQueue — Quản lý hàng đợi request khi Access Token hết hạn.
 *
 * Khi nhiều request đồng thời nhận 401:
 * 1. Request đầu tiên trigger refresh.
 * 2. Các request còn lại được đẩy vào hàng đợi.
 * 3. Khi refresh thành công → replay toàn bộ hàng đợi với token mới.
 * 4. Khi refresh thất bại → reject toàn bộ hàng đợi.
 *
 * Đảm bảo chỉ 1 request refresh chạy tại bất kỳ thời điểm nào.
 */

interface QueueItem {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  config: InternalAxiosRequestConfig;
}

let isRefreshing = false;
const queue: QueueItem[] = [];

// ─── Public API ───────────────────────────────────────────

export function isCurrentlyRefreshing(): boolean {
  return isRefreshing;
}

export function setRefreshing(value: boolean): void {
  isRefreshing = value;
}

/**
 * Đẩy một request thất bại vào hàng đợi.
 * Trả về Promise sẽ được resolve khi refresh thành công.
 */
export function enqueue(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, config });
  });
}

/**
 * Replay toàn bộ request trong hàng đợi với token mới.
 */
export function processQueue(newToken: string): void {
  queue.forEach(({ resolve, config }) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`;
    }
    resolve(config);
  });
  queue.length = 0;
}

/**
 * Reject toàn bộ request trong hàng đợi khi refresh thất bại.
 */
export function rejectQueue(error: any): void {
  queue.forEach(({ reject }) => {
    reject(error);
  });
  queue.length = 0;
}

/**
 * Reset trạng thái (dùng trong testing hoặc logout).
 */
export function resetQueue(): void {
  isRefreshing = false;
  queue.length = 0;
}
