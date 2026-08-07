import * as assignmentService from './assignmentService';
import type {
  InternAssignment,
  AssignPayload,
  ReassignPayload,
  AssignmentHistory,
  MentorCapacityInfo
} from '../models/assignment';

export class AssignmentFacade {
  static async checkCapacity(mentorId: string): Promise<MentorCapacityInfo> {
    return await assignmentService.checkMentorCapacity(mentorId);
  }

  static async assignIntern(payload: AssignPayload): Promise<InternAssignment> {
    const capacity = await this.checkCapacity(payload.mentorId);
    if (!capacity.available) {
      throw new Error(`Mentor ${capacity.mentorName} đã đạt giới hạn sức chứa tối đa (${capacity.maxCapacity} thực tập sinh).`);
    }
    return await assignmentService.assignIntern(payload);
  }

  static async reassignMentor(payload: ReassignPayload): Promise<InternAssignment> {
    const capacity = await this.checkCapacity(payload.newMentorId);
    if (!capacity.available) {
      throw new Error(`Mentor mới ${capacity.mentorName} đã đạt giới hạn sức chứa tối đa (${capacity.maxCapacity} thực tập sinh).`);
    }
    return await assignmentService.reassignMentor(payload);
  }

  static async loadHistory(internId: string): Promise<AssignmentHistory[]> {
    return await assignmentService.fetchAssignmentHistory(internId);
  }
}
