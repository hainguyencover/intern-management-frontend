export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  phone?: string;
  department?: string;
  position?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
  requiresTwoFactor?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Setup2FAResponse {
  secretKey: string;
  qrCodeUrl: string;
}

export interface Verify2FARequest {
  code: string;
  secretKey: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}
