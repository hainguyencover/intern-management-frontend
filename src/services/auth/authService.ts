import apiClient from '@/services/api/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  User,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  Setup2FAResponse,
  Verify2FARequest,
  UpdateProfileRequest
} from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Swallowed as local tokens are purged regardless
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const { data } = await apiClient.put<User>('/auth/profile', profileData);
    return data;
  },

  async changePassword(passData: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword: passData.currentPassword,
      newPassword: passData.newPassword
    });
  },

  async forgotPassword(req: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/auth/forgot-password', req);
  },

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token: req.token,
      newPassword: req.newPassword
    });
  },

  async setup2FA(): Promise<Setup2FAResponse> {
    const { data } = await apiClient.post<Setup2FAResponse>('/auth/2fa/setup');
    return data;
  },

  async verify2FA(req: Verify2FARequest): Promise<void> {
    await apiClient.post('/auth/2fa/verify', req);
  },

  async disable2FA(): Promise<void> {
    await apiClient.post('/auth/2fa/disable');
  }
};

export default authService;
