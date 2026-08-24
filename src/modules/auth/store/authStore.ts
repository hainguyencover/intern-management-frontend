import { defineStore } from 'pinia';
import type { AuthenticatedUser, LoginRequest } from '../models/auth';
import * as authService from '../services/authService';
import * as sessionManager from '../services/sessionManager';
import { AuthEvent, AuthStatus } from '../constants/authEvents';

let initPromise: Promise<void> | null = null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: AuthStatus.INITIALIZING as AuthStatus,
    user: null as AuthenticatedUser | null,
    permissions: [] as string[],
    roles: [] as string[],
    authenticated: false,
    loading: false,

    // ─── Session State ─────────────────────────────────────
    refreshing: false,
    lastActivity: null as number | null
  }),

  actions: {
    /**
     * Khởi tạo và khôi phục phiên tự động khi ứng dụng bootstrap (F5).
     */
    async initializeAuth(): Promise<void> {
      if (this.status === AuthStatus.AUTHENTICATED) return;
      if (initPromise) return initPromise;

      initPromise = (async () => {
        this.status = AuthStatus.INITIALIZING;
        try {
          const user = await authService.getProfile();
          this.user = user;
          this.roles = user.roles || [];
          this.permissions = user.permissions || [];
          this.authenticated = true;
          this.status = AuthStatus.AUTHENTICATED;
          this.lastActivity = Date.now();
        } catch (error) {
          this.user = null;
          this.roles = [];
          this.permissions = [];
          this.authenticated = false;
          this.status = AuthStatus.UNAUTHENTICATED;
        } finally {
          initPromise = null;
        }
      })();

      return initPromise;
    },

    /**
     * Đăng nhập: ủy quyền HTTP cho authService, cập nhật state.
     */
    async login(payload: LoginRequest): Promise<void> {
      this.loading = true;
      try {
        const user = await authService.login(payload);
        this.user = user;
        this.roles = user.roles || [];
        this.permissions = user.permissions || [];
        this.authenticated = true;
        this.status = AuthStatus.AUTHENTICATED;
        this.lastActivity = Date.now();

        sessionManager.broadcastEvent(AuthEvent.LOGIN_SUCCESS);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Đăng ký tài khoản ứng viên.
     */
    async register(payload: import('../models/auth').RegisterRequest): Promise<void> {
      this.loading = true;
      try {
        const user = await authService.register(payload);
        this.user = user;
        this.roles = user.roles || [];
        this.permissions = user.permissions || [];
        this.authenticated = true;
        this.status = AuthStatus.AUTHENTICATED;
        this.lastActivity = Date.now();

        sessionManager.broadcastEvent(AuthEvent.LOGIN_SUCCESS);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Xác thực email với token.
     */
    async verifyEmail(token: string): Promise<void> {
      await authService.verifyEmail(token);
      if (this.user) {
        this.user.emailVerified = true;
      }
    },

    /**
     * Yêu cầu gửi lại email xác thực.
     */
    async resendVerification(email: string): Promise<void> {
      await authService.resendVerification(email);
    },

    /**
     * Đăng xuất chủ động.
     */
    async logout(): Promise<void> {
      try {
        await authService.logout();
      } finally {
        sessionManager.broadcastEvent(AuthEvent.LOGOUT);
        this.$reset();
        this.status = AuthStatus.UNAUTHENTICATED;
      }
    },

    /**
     * Xóa session cục bộ.
     */
    clearSession(): void {
      authService.clearToken();
      this.$reset();
      this.status = AuthStatus.UNAUTHENTICATED;
    },

    /**
     * Cập nhật thời gian tương tác cuối cùng.
     */
    touchActivity(): void {
      this.lastActivity = Date.now();
    }
  }
});
