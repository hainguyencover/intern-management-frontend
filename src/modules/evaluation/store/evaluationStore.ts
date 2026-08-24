import { defineStore } from 'pinia';
import type { Evaluation, EvaluationStatus } from '../models/evaluation';
import { EvaluationFacade } from '../services/evaluationFacade';

export const useEvaluationStore = defineStore('evaluation', {
  state: () => ({
    items: [] as Evaluation[],
    totalElements: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
    statusFilter: '' as EvaluationStatus | '',
    loading: false,
    error: null as string | null,
    activeEvaluation: null as Evaluation | null
  }),

  actions: {
    async fetchEvaluations(query?: any): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await EvaluationFacade.loadEvaluations({
          page: query?.page || this.page,
          limit: query?.limit || this.limit,
          status: query?.status !== undefined ? query.status : this.statusFilter
        });
        const rawContent = res?.content ?? (res as any)?.data?.content ?? (Array.isArray(res) ? res : []);
        this.items = Array.isArray(rawContent) ? rawContent : [];
        this.totalElements = res?.totalElements ?? (res as any)?.data?.totalElements ?? this.items.length;
        this.totalPages = res?.totalPages ?? (res as any)?.data?.totalPages ?? 1;
        this.page = res?.page ?? (res as any)?.data?.page ?? 1;
        this.limit = res?.limit ?? (res as any)?.data?.size ?? 10;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải danh sách bài đánh giá.';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },


    setStatusFilter(status: EvaluationStatus | ''): void {
      this.statusFilter = status;
      this.page = 1;
      this.fetchEvaluations();
    },

    setPage(page: number): void {
      this.page = page;
      this.fetchEvaluations();
    }
  }
});
