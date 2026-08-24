import client from '@/shared/api/client';
import type {
  Mentor,
  CreateMentorPayload,
  UpdateMentorPayload,
  MentorStatusUpdatePayload,
  MentorDashboardStats,
} from '../types/mentor';

export const mentorApi = {
  searchMentors(params?: { search?: string; status?: string; departmentId?: number; page?: number; size?: number }) {
    return client.get('/api/v1/mentors', { params });
  },

  getMentorById(id: number) {
    return client.get(`/api/v1/mentors/${id}`);
  },

  getMentorByUserId(userId: number) {
    return client.get(`/api/v1/mentors/user/${userId}`);
  },

  createMentor(payload: CreateMentorPayload) {
    return client.post('/api/v1/mentors', payload);
  },

  updateMentor(id: number, payload: UpdateMentorPayload) {
    return client.put(`/api/v1/mentors/${id}`, payload);
  },

  updateMentorStatus(id: number, payload: MentorStatusUpdatePayload) {
    return client.patch(`/api/v1/mentors/${id}/status`, payload);
  },

  deleteMentor(id: number) {
    return client.delete(`/api/v1/mentors/${id}`);
  },

  getDashboardStats() {
    return client.get('/api/v1/mentors/me/dashboard');
  },

  getAssignedInterns(params?: { keyword?: string; status?: string; page?: number; size?: number }) {
    return client.get('/api/v1/mentors/assigned-interns', { params });
  },
};
