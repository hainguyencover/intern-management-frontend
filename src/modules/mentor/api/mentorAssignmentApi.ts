import client from '@/shared/api/client';
import type {
  AssignMentorPayload,
  ReassignMentorPayload,
  BulkAssignMentorPayload,
} from '../types/mentorAssignment';

export const mentorAssignmentApi = {
  assignMentor(payload: AssignMentorPayload) {
    return client.post('/api/v1/mentor-assignments', payload);
  },

  reassignMentor(assignmentId: number, payload: ReassignMentorPayload) {
    return client.post(`/api/v1/mentor-assignments/${assignmentId}/reassign`, payload);
  },

  completeAssignment(assignmentId: number, reason?: string) {
    return client.patch(`/api/v1/mentor-assignments/${assignmentId}/complete`, null, { params: { reason } });
  },

  cancelAssignment(assignmentId: number, reason?: string) {
    return client.patch(`/api/v1/mentor-assignments/${assignmentId}/cancel`, null, { params: { reason } });
  },

  bulkAssign(payload: BulkAssignMentorPayload) {
    return client.post('/api/v1/mentor-assignments/bulk', payload);
  },

  suggestMentors(internId: number) {
    return client.get('/api/v1/mentor-assignments/suggest', { params: { internId } });
  },

  getInternMentorHistory(internId: number) {
    return client.get(`/api/v1/interns/${internId}/mentor-history`);
  },

  getMentorActiveInterns(mentorId: number) {
    return client.get(`/api/v1/mentors/${mentorId}/interns`);
  },

  getMentorCapacity(mentorId: number) {
    return client.get(`/api/v1/mentors/${mentorId}/capacity`);
  },
};
