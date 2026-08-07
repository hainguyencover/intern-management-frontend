import { defineStore } from 'pinia';
import type { Task, TaskComment, DailyReport, TaskStatus } from '../models/task';
import { TaskFacade } from '../services/taskFacade';

export const useTaskStore = defineStore('task', {
  state: () => ({
    items: [] as Task[],
    totalElements: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
    search: '',
    statusFilter: '' as TaskStatus | '',
    loading: false,
    error: null as string | null,
    activeTask: null as Task | null,
    activeComments: [] as TaskComment[],
    dailyReports: [] as DailyReport[]
  }),

  actions: {
    async fetchTasks(query?: any): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await TaskFacade.loadTasks({
          page: query?.page || this.page,
          limit: query?.limit || this.limit,
          search: query?.search !== undefined ? query.search : this.search,
          status: query?.status !== undefined ? query.status : this.statusFilter
        });
        this.items = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.page = res.page;
        this.limit = res.limit;
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải danh sách nhiệm vụ.';
      } finally {
        this.loading = false;
      }
    },

    setSearch(search: string): void {
      this.search = search;
      this.page = 1;
      this.fetchTasks();
    },

    setStatusFilter(status: TaskStatus | ''): void {
      this.statusFilter = status;
      this.page = 1;
      this.fetchTasks();
    },

    setPage(page: number): void {
      this.page = page;
      this.fetchTasks();
    },

    setActiveTask(task: Task | null): void {
      this.activeTask = task;
    },

    async fetchComments(taskId: string): Promise<void> {
      try {
        this.activeComments = await TaskFacade.loadComments(taskId);
      } catch {
        this.activeComments = [];
      }
    }
  }
});
