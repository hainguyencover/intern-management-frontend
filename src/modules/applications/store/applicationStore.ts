import { defineStore } from 'pinia';
import { applicationService } from '../services/applicationService';
import type { ApplicationResponse, Program } from '../types/application';

export const useApplicationStore = defineStore('application', {
  state: () => ({
    activePrograms: [] as Program[],
    myApplications: [] as ApplicationResponse[],
    currentSubmittedApp: null as ApplicationResponse | null,
    loadingPrograms: false,
    submitting: false,
    error: null as string | null
  }),

  actions: {
    async fetchActivePrograms(): Promise<void> {
      this.loadingPrograms = true;
      this.error = null;
      try {
        this.activePrograms = await applicationService.getActivePrograms();
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Không thể tải danh sách chương trình thực tập';
      } finally {
        this.loadingPrograms = false;
      }
    },

    async fetchMyApplications(): Promise<void> {
      try {
        this.myApplications = await applicationService.getMyApplications();
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async submit(programId: number, position: string, note?: string): Promise<ApplicationResponse> {
      this.submitting = true;
      this.error = null;
      try {
        const result = await applicationService.submitApplication({
          programId,
          position,
          note
        });
        this.currentSubmittedApp = result;
        return result;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Nộp hồ sơ thất bại. Vui lòng kiểm tra lại.';
        throw err;
      } finally {
        this.submitting = false;
      }
    }
  }
});
