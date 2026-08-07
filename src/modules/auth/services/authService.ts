import { apiClient } from '../../../shared/api/client';
import type { LoginRequest, JwtResponseDto, AuthenticatedUser } from '../models/auth';

/**
 * AuthService — Tầng dịch vụ HTTP duy nhất cho nghiệp vụ xác thực.
 *
 * Trách nhiệm:
 * - Giao tiếp HTTP với Backend Auth API.
 * - Quản lý Access Token trong bộ nhớ (in-memory, không persist).
 * - Cung cấp getter/setter cho Axios interceptor.
 *
 * Refresh Token do Backend quản lý hoàn toàn qua HttpOnly Cookie.
 * Frontend KHÔNG BAO GIỜ chạm vào Refresh Token.
 */

// ─── In-memory token storage (private) ────────────────────
let accessToken: string | null = null;

// ─── Public API ───────────────────────────────────────────

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearToken(): void {
  accessToken = null;
}

// ─── Mapper: DTO → Domain Model ──────────────────────────

function mapJwtResponseToUser(dto: JwtResponseDto): AuthenticatedUser {
  return {
    roles: dto.roles ?? [],
    permissions: dto.permissions ?? []
  };
}

// ─── HTTP Methods ─────────────────────────────────────────

export async function login(payload: LoginRequest): Promise<AuthenticatedUser> {
  const response = await apiClient.post<JwtResponseDto>('/api/v1/auth/login', payload, {
    withCredentials: true // Backend sets HttpOnly Cookie for refresh token
  });

  const dto = response.data;

  // Lưu access token vào bộ nhớ (in-memory only)
  setAccessToken(dto.accessToken);

  return mapJwtResponseToUser(dto);
}

export async function getProfile(): Promise<AuthenticatedUser> {
  const response = await apiClient.get<JwtResponseDto>('/api/v1/auth/me', {
    withCredentials: true
  });
  const dto = response.data;
  if (dto.accessToken) {
    setAccessToken(dto.accessToken);
  }
  return mapJwtResponseToUser(dto);
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout', {}, { withCredentials: true });
  } finally {
    clearToken();
  }
}
