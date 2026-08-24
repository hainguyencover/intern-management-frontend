import { defineStore } from 'pinia';
import { taskApi } from '../api/taskApi';

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        currentTask: null,
        progressHistory: [],
        groupInterns: [],
        overdueTasks: [],
        loading: false,
        historyLoading: false,
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
        filters: {
            status: '',
            priority: '',
            keyword: '',
            groupId: null,
        }
    }),

    actions: {
        async fetchMentorTasks(groupId, params = {}) {
            this.loading = true;
            try {
                const queryParams = {
                    page: this.currentPage,
                    size: this.pageSize,
                    ...params
                };
                if (groupId) queryParams.groupId = groupId;
                if (this.filters.status) queryParams.status = this.filters.status;

                const res = await taskApi.getMentorTasks(queryParams);
                const pageData = (res && res.success !== undefined) ? res.data : (res?.data || res);
                const meta = (res && res.success !== undefined) ? res.meta : res?.meta;

                this.tasks = Array.isArray(pageData) ? pageData : (pageData?.content || []);
                this.totalElements = meta?.totalElements !== undefined ? meta.totalElements : (pageData?.totalElements || this.tasks.length);
                this.totalPages = meta?.totalPages !== undefined ? meta.totalPages : (pageData?.totalPages || 1);
            } catch (err) {
                console.error('Failed to fetch mentor tasks, attempting fallback', err);
                try {
                    const fallbackRes = await taskApi.getTasks({
                        groupId: groupId || undefined,
                        status: this.filters.status || undefined
                    });
                    const fallbackData = (fallbackRes && fallbackRes.success !== undefined) ? fallbackRes.data : (fallbackRes?.data || fallbackRes);
                    this.tasks = Array.isArray(fallbackData) ? fallbackData : (fallbackData?.content || []);
                } catch (e) {
                    this.tasks = [];
                }
            } finally {
                this.loading = false;
            }
        },

        async fetchInternTasks(params = {}) {
            this.loading = true;
            try {
                const res = await taskApi.getAssignedToMe({
                    status: this.filters.status || undefined,
                    page: this.currentPage,
                    size: this.pageSize,
                    ...params
                });
                const pageData = (res && res.success !== undefined) ? res.data : (res?.data || res);
                const meta = (res && res.success !== undefined) ? res.meta : res?.meta;

                this.tasks = Array.isArray(pageData) ? pageData : (pageData?.content || []);
                this.totalElements = meta?.totalElements !== undefined ? meta.totalElements : (pageData?.totalElements || this.tasks.length);
                this.totalPages = meta?.totalPages !== undefined ? meta.totalPages : (pageData?.totalPages || 1);
            } catch (err) {
                console.error('Failed to fetch intern tasks', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchOverdueTasks() {
            try {
                const res = await taskApi.getOverdueTasks();
                this.overdueTasks = res.data?.data || res.data || [];
            } catch (err) {
                console.error('Failed to fetch overdue tasks', err);
                this.overdueTasks = [];
            }
        },

        async fetchTaskDetail(taskId) {
            this.loading = true;
            try {
                const res = await taskApi.getTaskDetail(taskId);
                this.currentTask = res.data?.data || res.data;
            } catch (err) {
                console.error('Failed to fetch task detail', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchMentorTaskDetail(taskId) {
            this.loading = true;
            try {
                const res = await taskApi.getMentorTaskDetail(taskId);
                this.currentTask = res.data?.data || res.data;
                return this.currentTask;
            } catch (err) {
                console.error('Failed to fetch mentor task detail', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchInternTaskDetail(taskId) {
            this.loading = true;
            try {
                const res = await taskApi.getInternTaskDetail(taskId);
                this.currentTask = res.data?.data || res.data;
                return this.currentTask;
            } catch (err) {
                console.error('Failed to fetch intern task detail', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchProgressHistory(taskId) {
            this.historyLoading = true;
            try {
                const res = await taskApi.getProgressHistory(taskId);
                this.progressHistory = res.data?.data || res.data || [];
            } catch (err) {
                console.error('Failed to fetch progress history', err);
                this.progressHistory = [];
            } finally {
                this.historyLoading = false;
            }
        },

        async createMentorTask(payload) {
            this.loading = true;
            try {
                const res = await taskApi.createMentorTasks(payload);
                return res.data;
            } catch (err) {
                console.error('Failed to create mentor task', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateMentorTask(taskId, payload) {
            this.loading = true;
            try {
                const res = await taskApi.updateMentorTask(taskId, payload);
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                return updated;
            } catch (err) {
                console.error('Failed to update mentor task', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async deleteMentorTask(taskId) {
            this.loading = true;
            try {
                await taskApi.deleteMentorTask(taskId);
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.totalElements = Math.max(0, this.totalElements - 1);
            } catch (err) {
                console.error('Failed to delete mentor task', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateProgress(taskId, progressPercent, content) {
            try {
                const res = await taskApi.updateProgress(taskId, { progressPercent, content });
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                if (this.currentTask && this.currentTask.id === taskId) {
                    this.currentTask = { ...this.currentTask, ...updated };
                }
                await this.fetchProgressHistory(taskId);
                return updated;
            } catch (err) {
                console.error('Failed to update progress', err);
                throw err;
            }
        },

        async submitTask(taskId, note) {
            try {
                const res = await taskApi.submitTask(taskId, note);
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                await this.fetchProgressHistory(taskId);
                return updated;
            } catch (err) {
                console.error('Failed to submit task', err);
                throw err;
            }
        },

        async approveTask(taskId, note) {
            try {
                const res = await taskApi.approveTask(taskId, note);
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                await this.fetchProgressHistory(taskId);
                return updated;
            } catch (err) {
                console.error('Failed to approve task', err);
                throw err;
            }
        },

        async rejectTask(taskId, reason) {
            try {
                const res = await taskApi.rejectTask(taskId, reason);
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                await this.fetchProgressHistory(taskId);
                return updated;
            } catch (err) {
                console.error('Failed to reject task', err);
                throw err;
            }
        },

        async cancelTask(taskId, reason) {
            try {
                const res = await taskApi.cancelTask(taskId, reason);
                const updated = res.data?.data || res.data;
                const idx = this.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    this.tasks[idx] = { ...this.tasks[idx], ...updated };
                }
                await this.fetchProgressHistory(taskId);
                return updated;
            } catch (err) {
                console.error('Failed to cancel task', err);
                throw err;
            }
        },

        async fetchGroupInterns(groupId) {
            try {
                const res = await taskApi.getGroupInterns(groupId);
                this.groupInterns = (res && res.success !== undefined) ? res.data : (res.data?.data || res.data || []);
            } catch (err) {
                console.error('Failed to fetch group interns', err);
                this.groupInterns = [];
            }
        },

        setPage(page) {
            this.currentPage = page;
        },

        setPageSize(size) {
            this.pageSize = size;
            this.currentPage = 0;
        }
    }
});
