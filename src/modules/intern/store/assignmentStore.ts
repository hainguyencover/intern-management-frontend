import { defineStore } from 'pinia';
import type { InternAssignment, AssignmentHistory, MentorCapacityInfo } from '../models/assignment';
import { AssignmentFacade } from '../services/assignmentFacade';

export const useAssignmentStore = defineStore('assignment', {
  state: () => ({
    activeAssignment: null as InternAssignment | null,
    history: [] as AssignmentHistory[],
    capacityInfo: null as MentorCapacityInfo | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async checkCapacity(mentorId: string): Promise<MentorCapacityInfo> {
      const info = await AssignmentFacade.checkCapacity(mentorId);
      this.capacityInfo = info;
      return info;
    },

    async fetchHistory(internId: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        this.history = await AssignmentFacade.loadHistory(internId);
      } catch (err: any) {
        this.error = err?.message || 'Không thể tải lịch sử phân công.';
      } finally {
        this.loading = false;
      }
    }
  }
});
