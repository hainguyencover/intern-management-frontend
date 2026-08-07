import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { appConfig } from '../../app/config';

/**
 * Session Interceptor — Quản lý Bearer token và refresh flow.
 *
 * Trách nhiệm:
 * - Gắn Access Token vào mọi request (Request Interceptor).
 * - Xử lý 401 → trigger refresh → replay request (Response Interceptor).
 * - Retry Policy: chỉ retry 401, tối đa 1 lần.
 */
export function registerSessionInterceptor(client: AxiosInstance): void {
  // ─── Lazy imports (tránh circular dependency) ──────────
  let authServiceModule: typeof import('../../modules/auth/services/authService') | null = null;
  let refreshQueueModule: typeof import('../../modules/auth/services/refreshQueue') | null = null;

  async function getAuthService() {
    if (!authServiceModule) {
      authServiceModule = await import('../../modules/auth/services/authService');
    }
    return authServiceModule;
  }

  async function getRefreshQueue() {
    if (!refreshQueueModule) {
      refreshQueueModule = await import('../../modules/auth/services/refreshQueue');
    }
    return refreshQueueModule;
  }

  // ─── Request Interceptor ────────────────────────────────
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { getAccessToken } = await getAuthService();
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ─── Response Interceptor (401 handling) ────────────────
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { config, response } = error;

      // Retry Policy: chỉ retry 401, tối đa 1 lần
      if (response?.status !== 401 || !config || (config as any)._retry) {
        return Promise.reject(error);
      }

      (config as any)._retry = true;

      const queue = await getRefreshQueue();
      const authSvc = await getAuthService();

      if (!queue.isCurrentlyRefreshing()) {
        queue.setRefreshing(true);
        try {
          // Silent token rotation — Backend reads HttpOnly Cookie
          const refreshResponse = await axios.post(
            `${appConfig.apiBaseUrl}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = refreshResponse.data.accessToken;
          authSvc.setAccessToken(newToken);

          queue.setRefreshing(false);
          queue.processQueue(newToken);

          // Replay original request với token mới
          if (config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
          return client(config);
        } catch (refreshError) {
          queue.setRefreshing(false);
          queue.rejectQueue(refreshError);
          authSvc.clearToken();

          // Dispatch session expired — sẽ được bắt bởi sessionManager
          window.dispatchEvent(new CustomEvent('holaho:session-expired'));

          return Promise.reject(refreshError);
        }
      }

      // Request này chờ trong hàng đợi cho đến khi refresh hoàn tất
      const updatedConfig = await queue.enqueue(config);
      return client(updatedConfig);
    }
  );
}
