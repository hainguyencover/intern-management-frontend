/**
 * Enum chuẩn hóa tất cả sự kiện xác thực trong hệ thống.
 *
 * Được sử dụng bởi:
 * - sessionManager.ts (BroadcastChannel messages)
 * - sessionInterceptor.ts (trigger events)
 * - authStore.ts (reactive state updates)
 */
export enum AuthEvent {
  /** Đăng nhập thành công */
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  /** Đăng nhập thất bại */
  LOGIN_FAILED = 'LOGIN_FAILED',

  /** Access Token đã được refresh ngầm thành công */
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',

  /** Refresh Token hết hạn hoặc bị revoke — không thể refresh */
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',

  /** Phiên đăng nhập hết hạn — cần hiển thị dialog */
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  /** Người dùng chủ động đăng xuất */
  LOGOUT = 'LOGOUT'
}

/**
 * Trạng thái phiên xác thực (State Machine)
 */
export enum AuthStatus {
  /** Đang trong quá trình khởi tạo/khôi phục phiên */
  INITIALIZING = 'INITIALIZING',

  /** Đã xác thực thành công */
  AUTHENTICATED = 'AUTHENTICATED',

  /** Chưa xác thực / Đã đăng xuất */
  UNAUTHENTICATED = 'UNAUTHENTICATED',

  /** Phiên làm việc đã hết hạn */
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  /** Tài khoản tạm thời bị khóa */
  LOCKED = 'LOCKED'
}
