import { defineStore } from 'pinia';
import type { Department, DepartmentQuery } from '../models/department';
import { DepartmentFacade } from '../services/departmentFacade';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    items: [] as Department[],
    total: 0,
    page: 1,
    limit: 10,
    search: '',
    statusFilter: '',
    loading: false,
    error: null as string | null,
    activeItem: null as Department | null
  }),

  actions: {
    async fetchList(query?: DepartmentQuery): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await DepartmentFacade.loadDepartments({
          page: query?.page || this.page,
          limit: query?.limit || this.limit,
          search: query?.search !== undefined ? query.search : this.search,
          status: query?.status !== undefined ? query.status : this.statusFilter
        });
        this.items = res.items;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải danh sách phòng ban.';
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

    setPage(page: number): void {
      this.page = page;
      this.fetchList();
    },

    setActiveItem(item: Department | null): void {
      this.activeItem = item;
    }
  }
});
