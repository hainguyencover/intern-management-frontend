// ─── API DTO (khớp 1:1 với Backend response) ─────────────

/** Request body gửi đến POST /api/v1/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response body trả về từ Backend sau khi login thành công */
export interface JwtResponseDto {
  accessToken: string;
  // refreshToken không xuất hiện ở đây vì Backend set qua HttpOnly Cookie
  roles: string[];
  permissions: string[];
}

// ─── Domain Model (Frontend sử dụng nội bộ) ──────────────

/** Thông tin người dùng đã xác thực — KHÔNG chứa token */
export interface AuthenticatedUser {
  roles: string[];
  permissions: string[];
}
