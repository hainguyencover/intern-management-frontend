import type { AxiosInstance } from 'axios';

export function registerIdempotencyInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    
    // Inject x-idempotency-key only for mutations (POST, PUT, DELETE)
    if (method && ['POST', 'PUT', 'DELETE'].includes(method)) {
      const uuid = 'idemp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
      config.headers = config.headers || {};
      config.headers['x-idempotency-key'] = uuid;
    }
    
    return config;
  });
}
