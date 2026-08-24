import { apiClient } from '../../../shared/api/client';
import type { ApplicationResponse, ApplicationSubmitPayload, Program } from '../types/application';

export const applicationService = {
  /**
   * Fetch list of active programs for candidate selection
   */
  async getActivePrograms(): Promise<Program[]> {
    try {
      const response = await apiClient.get<any>('/api/v1/programs', {
        params: { status: 'ACTIVE', size: 100 }
      });
      const data = response.data?.data?.content || response.data?.data || response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch active programs, providing default active programs');
    }

    return [
      {
        id: 1,
        name: 'Chương trình Thực tập Software Engineer 2026',
        description: 'Tuyển dụng Thực tập sinh Lập trình Java Backend & Frontend Vue.js',
        status: 'ACTIVE'
      },
      {
        id: 2,
        name: 'Chương trình Thực tập QA & Automation Testing 2026',
        description: 'Tuyển dụng Thực tập sinh Kiểm thử phần mềm tự động & Manual Test',
        status: 'ACTIVE'
      }
    ];
  },

  /**
   * Submit an application
   */
  async submitApplication(payload: ApplicationSubmitPayload): Promise<ApplicationResponse> {
    const response = await apiClient.post<any>('/api/v1/applications', payload);
    return response.data?.data || response.data;
  },

  /**
   * Get candidate's own applications
   */
  async getMyApplications(): Promise<ApplicationResponse[]> {
    const response = await apiClient.get<any>('/api/v1/applications/me');
    return response.data?.data || response.data || [];
  },

  /**
   * Get specific application by ID
   */
  async getApplicationById(id: number): Promise<ApplicationResponse> {
    const response = await apiClient.get<any>(`/api/v1/applications/${id}`);
    return response.data?.data || response.data;
  },

  /**
   * Upload application document (CV / Application letter)
   */
  async uploadDocument(type: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post<any>('/api/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data?.data || response.data;
  }
};
