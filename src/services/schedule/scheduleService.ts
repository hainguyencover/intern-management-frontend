import apiClient from '@/services/api/apiClient';
import type { ScheduleEvent, ScheduleMilestone } from '@/types/schedule';

export const scheduleService = {
  async getScheduleEvents(): Promise<ScheduleEvent[]> {
    const { data } = await apiClient.get<ScheduleEvent[]>('/schedules/events');
    return data;
  },

  async getScheduleMilestones(): Promise<ScheduleMilestone[]> {
    const { data } = await apiClient.get<ScheduleMilestone[]>('/schedules/milestones');
    return data;
  }
};

export default scheduleService;
