export type MentorAssignmentStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ENDED';
export type MentorAssignmentType = 'PRIMARY' | 'SECONDARY';

export interface MentorAssignment {
  id: number;
  enrollmentId?: number;
  internId: number;
  internName?: string;
  internEmail?: string;
  internCode?: string;
  mentorId: number;
  mentorName?: string;
  mentorEmail?: string;
  mentorEmployeeCode?: string;
  mentorDepartmentId?: number;
  mentorDepartmentName?: string;
  assignmentType: MentorAssignmentType;
  startDate: string;
  endDate?: string;
  status: MentorAssignmentStatus;
  responsibility?: string;
  assignedAt: string;
  endedAt?: string;
  assignedById?: number;
  assignedByName?: string;
  reason?: string;
}

export interface AssignMentorPayload {
  mentorId: number;
  internId: number;
  enrollmentId?: number;
  assignmentType?: MentorAssignmentType;
  startDate: string;
  endDate?: string;
  responsibility?: string;
}

export interface ReassignMentorPayload {
  newMentorId: number;
  effectiveStartDate: string;
  endDate?: string;
  assignmentType?: MentorAssignmentType;
  reason?: string;
  responsibility?: string;
}

export interface BulkAssignMentorPayload {
  mentorId: number;
  internIds: number[];
  assignmentType?: MentorAssignmentType;
  startDate: string;
  endDate?: string;
  responsibility?: string;
}

export interface SuggestedMentorItem {
  mentor: any;
  matchScorePercentage: number;
  matchReason: string;
  sameDepartmentMatch: boolean;
  currentAssignedCount: number;
  maxCapacity: number;
}

export interface MentorSuggestionResponse {
  internId: number;
  internName: string;
  internDepartmentName: string;
  suggestions: SuggestedMentorItem[];
}
