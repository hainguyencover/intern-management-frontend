import { defineStore } from 'pinia';
import type { InternProfile, InternQuery } from '../models/intern';
import { InternFacade } from '../services/internFacade';

export const useInternStore = defineStore('intern', {
  state: () => ({
    items: [] as InternProfile[],
    totalElements: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
    search: '',
    statusFilter: '',
    universityFilter: '',
    majorFilter: '',
    loading: false,
    error: null as string | null,
    activeIntern: null as InternProfile | null
  }),

  actions: {
    async fetchList(query?: InternQuery): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await InternFacade.loadInterns({
          page: query?.page !== undefined ? query.page : this.page,
          limit: query?.limit !== undefined ? query.limit : this.limit,
          search: query?.search !== undefined ? query.search : this.search,
          status: query?.status !== undefined ? query.status : this.statusFilter,
          university: query?.university !== undefined ? query.university : this.universityFilter,
          major: query?.major !== undefined ? query.major : this.majorFilter
        });
        this.items = res?.content || [];
        this.totalElements = res?.totalElements || 0;
        this.totalPages = res?.totalPages || 1;
        this.page = res?.page || 1;
        this.limit = res?.limit || 10;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải danh sách hồ sơ thực tập sinh.';
      } finally {
        this.loading = false;
      }
    },

    setSearch(search: string): void {
      this.search = search;
      this.page = 1;
      this.fetchList();
    },

    setStatusFilter(status: string): void {
      this.statusFilter = status;
      this.page = 1;
      this.fetchList();
    },

    setUniversityFilter(university: string): void {
      this.universityFilter = university;
      this.page = 1;
      this.fetchList();
    },

    setMajorFilter(major: string): void {
      this.majorFilter = major;
      this.page = 1;
      this.fetchList();
    },

    clearAllFilters(): void {
      this.search = '';
      this.statusFilter = '';
      this.universityFilter = '';
      this.majorFilter = '';
      this.page = 1;
      this.fetchList();
    },

    setPage(page: number): void {
      this.page = page;
      this.fetchList();
    },

    setLimit(limit: number): void {
      this.limit = limit;
      this.page = 1;
      this.fetchList();
    },

    setActiveIntern(intern: InternProfile | null): void {
      this.activeIntern = intern;
    }
  }
});
