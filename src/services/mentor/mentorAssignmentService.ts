import apiClient from '@/services/api/apiClient';
import type { MentorAssignmentHistory, UnassignMentorPayload } from '@/types/mentor';

export const mentorAssignmentService = {
  async unassignMentor(assignmentId: number, payload: UnassignMentorPayload): Promise<MentorAssignmentHistory> {
    const { data } = await apiClient.patch<{ data: MentorAssignmentHistory }>(
      `/mentor-assignments/${assignmentId}/unassign`,
      payload
    );
    return data.data || data;
  },

  async getInternAssignmentHistory(internId: number): Promise<MentorAssignmentHistory[]> {
    const { data } = await apiClient.get<{ data: MentorAssignmentHistory[] }>(
      `/interns/${internId}/mentor-history`
    );
    return data.data || data;
  }
};

export default mentorAssignmentService;
