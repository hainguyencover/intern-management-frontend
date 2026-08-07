import { describe, it, expect, vi } from 'vitest';
import { notify } from '../../notification/notify';
import { ApiError } from '../../api/apiError';
import axios from 'axios';
import { registerErrorInterceptor } from '../../api/errorInterceptor';

describe('Integration Flow: API Error -> Interceptor -> Notification Toast', () => {
  it('should automatically publish error toast on interceptor failure', async () => {
    // Mock notify.error
    const notifySpy = vi.spyOn(notify, 'error');

    const client = axios.create();
    registerErrorInterceptor(client);

    // Mock API returning 400 bad request error response
    vi.spyOn(client.interceptors.response, 'use');

    // Simulate direct trigger of error callback
    const errorCallback = (client.interceptors.response as any).handlers[0].rejected;

    const mockAxiosError = {
      response: {
        status: 400,
        data: { message: 'Dữ liệu không hợp lệ!' }
      }
    };

    try {
      await errorCallback(mockAxiosError);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe('Dữ liệu không hợp lệ!');
    }

    expect(notifySpy).toHaveBeenCalled();
  });
});
