import { AuthEvent } from '../constants/authEvents';

/**
 * SessionManager — Đồng bộ phiên đăng nhập giữa nhiều tab.
 *
 * Sử dụng BroadcastChannel API (với fallback localStorage storage event).
 *
 * Khi Tab A logout → Tab B nhận event → tự động clear session + redirect.
 * Khi Tab A nhận SESSION_EXPIRED → Tab B cũng hiển thị dialog.
 */

type SessionEventHandler = (event: AuthEvent) => void;

let channel: BroadcastChannel | null = null;
let handler: SessionEventHandler | null = null;

// ─── Khởi tạo ─────────────────────────────────────────────

export function initSessionSync(onEvent: SessionEventHandler): void {
  handler = onEvent;

  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('holaho-auth');
    channel.onmessage = (ev: MessageEvent<AuthEvent>) => {
      handler?.(ev.data);
    };
  } else {
    // Fallback: storage event cho trình duyệt không hỗ trợ BroadcastChannel
    window.addEventListener('storage', onStorageFallback);
  }
}

// ─── Phát sự kiện ──────────────────────────────────────────

export function broadcastEvent(event: AuthEvent): void {
  if (channel) {
    channel.postMessage(event);
  } else {
    // Fallback: ghi vào localStorage để trigger storage event trên tab khác
    localStorage.setItem('holaho-auth-event', JSON.stringify({ event, ts: Date.now() }));
  }
}

// ─── Hủy ───────────────────────────────────────────────────

export function destroySessionSync(): void {
  if (channel) {
    channel.close();
    channel = null;
  } else {
    window.removeEventListener('storage', onStorageFallback);
  }
  handler = null;
}

// ─── Helpers ───────────────────────────────────────────────

function onStorageFallback(ev: StorageEvent): void {
  if (ev.key === 'holaho-auth-event' && ev.newValue) {
    try {
      const { event } = JSON.parse(ev.newValue);
      handler?.(event as AuthEvent);
    } catch {
      // Bỏ qua nếu parse thất bại
    }
  }
}
