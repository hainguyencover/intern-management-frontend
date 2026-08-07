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
        this.items = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.page = res.page;
        this.limit = res.limit;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải danh sách bài đánh giá.';
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
