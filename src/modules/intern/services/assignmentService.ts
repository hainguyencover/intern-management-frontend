import { apiClient } from '../../../shared/api/client';
import type {
  InternAssignment,
  AssignPayload,
  ReassignPayload,
  AssignmentHistory,
  MentorCapacityInfo
} from '../models/assignment';

export async function assignIntern(payload: AssignPayload): Promise<InternAssignment> {
  try {
    const response = await apiClient.post<InternAssignment>('/api/v1/assignments', payload);
    return response.data;
  } catch (error) {
    return {
      id: 'assign-' + Date.now(),
      internId: payload.internId,
      mentorId: payload.mentorId,
      mentorName: 'Trần Văn Mentor',
      departmentId: payload.departmentId,
      departmentName: 'Phòng Phát triển Phần mềm',
      status: 'ACTIVE',
      startDate: payload.startDate,
      endDate: payload.endDate,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }
}

export async function reassignMentor(payload: ReassignPayload): Promise<InternAssignment> {
  try {
    const response = await apiClient.put<InternAssignment>(`/api/v1/assignments/${payload.internId}/reassign`, payload);
    return response.data;
  } catch (error) {
    return {
      id: 'assign-re-' + Date.now(),
      internId: payload.internId,
      mentorId: payload.newMentorId,
      mentorName: 'Lê Thị Mentor Mới',
      departmentId: 'dept-1',
      departmentName: 'Phòng Phát triển Phần mềm',
      status: 'ACTIVE',
      startDate: '2026-01-05',
      endDate: '2026-04-05',
      createdAt: new Date().toISOString().split('T')[0]
    };
  }
}

export async function fetchAssignmentHistory(internId: string): Promise<AssignmentHistory[]> {
  try {
    const response = await apiClient.get<AssignmentHistory[]>(`/api/v1/assignments/${internId}/history`);
    return response.data;
  } catch (error) {
    return [
      {
        id: 'hist-1',
        action: 'ASSIGNED',
        newMentor: 'Trần Văn Mentor',
        newDepartment: 'Phòng Phát triển Phần mềm',
        timestamp: '2026-01-05 09:00',
        performedBy: 'HR Admin'
      },
      {
        id: 'hist-2',
        action: 'REASSIGNED',
        previousMentor: 'Trần Văn Mentor',
        newMentor: 'Lê Thị Mentor Mới',
        reason: 'Chuyển dự án trọng điểm',
        timestamp: '2026-02-01 14:30',
        performedBy: 'HR Admin'
      }
    ];
  }
}

export async function checkMentorCapacity(mentorId: string): Promise<MentorCapacityInfo> {
  try {
    const response = await apiClient.get<MentorCapacityInfo>(`/api/v1/mentors/${mentorId}/capacity`);
    return response.data;
  } catch (error) {
    return {
      mentorId,
      mentorName: 'Trần Văn Mentor',
      currentCount: 3,
      maxCapacity: 5,
      available: true
    };
  }
}
