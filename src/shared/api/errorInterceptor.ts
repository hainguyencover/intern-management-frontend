import type { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from './apiError';
import { notify } from '../notification/notify';

export function registerErrorInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const { response } = error;
      const status = response?.status || 500;
      const message =
        (response?.data as any)?.message ||
        error.message ||
        'Lỗi mạng không xác định. Vui lòng thử lại.';
      const errors = (response?.data as any)?.errors || null;
      const code = (response?.data as any)?.code || undefined;

      const apiError = new ApiError(status, message, errors, code);
      
      // Auto trigger unified global error notification
      notify.error({
        title: `Lỗi Hệ thống (${status})`,
        message: apiError.message
      });

      return Promise.reject(apiError);
    }
  );
}
