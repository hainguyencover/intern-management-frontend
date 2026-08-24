import axios from 'axios';
import { appConfig } from '../../app/config';
import { registerSessionInterceptor } from './sessionInterceptor';
import { registerErrorInterceptor } from './errorInterceptor';
import { registerIdempotencyInterceptor } from './idempotencyInterceptor';

/**
 * API Client — Axios instance duy nhất cho toàn bộ Frontend.
 *
 * File này chỉ chịu trách nhiệm:
 * 1. Khởi tạo Axios instance với cấu hình mặc định.
 * 2. Đăng ký các interceptor modules.
 *
 * Logic nghiệp vụ nằm trong:
 * - sessionInterceptor.ts (Bearer token, 401 refresh, retry policy)
 * - errorInterceptor.ts (normalize error response)
 */

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': '1'
  }
});

// Đăng ký interceptor theo đúng thứ tự:
// 1. Session interceptor (gắn token, xử lý 401 trước)
// 2. Idempotency interceptor (gắn x-idempotency-key)
// 3. Error interceptor (normalize lỗi cuối cùng)
registerSessionInterceptor(apiClient);
registerIdempotencyInterceptor(apiClient);
registerErrorInterceptor(apiClient);
