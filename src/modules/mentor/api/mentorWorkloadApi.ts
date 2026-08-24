import client from '@/shared/api/client';
import type {
  MentorWorkload,
  MentorWorkloadSummary,
  MentorActiveIntern,
  WorkloadFilterParams,
} from '../types/mentorWorkload';

export const mentorWorkloadApi = {
  getWorkloads(params?: WorkloadFilterParams) {
    return client.get('/api/v1/hr/mentors/workloads', { params });
  },

  getWorkloadSummary() {
    return client.get('/api/v1/hr/mentors/workloads/summary');
  },

  getMentorActiveInterns(mentorId: number) {
    return client.get(`/api/v1/hr/mentors/workloads/${mentorId}/interns`);
  },
};
