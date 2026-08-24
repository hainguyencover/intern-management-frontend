import { apiClient } from '../../../shared/api/client';
import type { LoginRequest, JwtResponseDto, AuthenticatedUser } from '../models/auth';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function clearToken(): void {
  accessToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

function mapJwtResponseToUser(dto: JwtResponseDto): AuthenticatedUser {
  return {
    roles: dto.roles ?? [],
    permissions: dto.permissions ?? []
  };
}

export async function login(payload: LoginRequest): Promise<AuthenticatedUser> {
  const response = await apiClient.post<any>('/api/v1/auth/login', payload, {
    withCredentials: true
  });

  const rawData = response.data?.data || response.data;
  const token = rawData.token || rawData.accessToken;

  if (token) {
    setAccessToken(token);
    if (rawData.refreshToken) {
      localStorage.setItem('refreshToken', rawData.refreshToken);
    }
  }

  return {
    id: rawData.id,
    email: rawData.email,
    fullName: rawData.fullName,
    roles: rawData.roles ?? [],
    permissions: rawData.permissions ?? [],
    emailVerified: rawData.emailVerified ?? false
  };
}

export async function register(payload: import('../models/auth').RegisterRequest): Promise<AuthenticatedUser> {
  const response = await apiClient.post<any>('/api/v1/auth/register', payload, {
    withCredentials: true
  });

  const rawData = response.data?.data || response.data;
  const token = rawData.token || rawData.accessToken;

  if (token) {
    setAccessToken(token);
    if (rawData.refreshToken) {
      localStorage.setItem('refreshToken', rawData.refreshToken);
    }
  }

  return {
    id: rawData.id,
    email: rawData.email,
    fullName: rawData.fullName,
    roles: rawData.roles ?? [],
    permissions: rawData.permissions ?? [],
    emailVerified: false
  };
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.post('/api/v1/auth/email-verification/verify', { token });
}

export async function resendVerification(email: string): Promise<void> {
  await apiClient.post('/api/v1/auth/email-verification/resend', { email });
}

export async function getProfile(): Promise<AuthenticatedUser> {
  const token = getAccessToken();
  if (token) {
    setAccessToken(token);
  }

  const response = await apiClient.get<any>('/api/v1/auth/me', {
    withCredentials: true
  });
  const rawData = response.data?.data || response.data;
  const newToken = rawData.token || rawData.accessToken;
  if (newToken) {
    setAccessToken(newToken);
  }
  return {
    id: rawData.id,
    email: rawData.email,
    fullName: rawData.fullName,
    roles: rawData.roles ?? [],
    permissions: rawData.permissions ?? [],
    emailVerified: rawData.emailVerified ?? false,
    applicationStatus: rawData.applicationStatus || rawData.status || rawData.internProfileStatus || (rawData.roles?.includes('INTERN') ? 'INTERNING' : '')
  };
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout', {}, { withCredentials: true });
  } finally {
    clearToken();
  }
}
