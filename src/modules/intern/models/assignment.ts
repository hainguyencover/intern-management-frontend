export interface InternAssignment {
  id: string;
  internId: string;
  mentorId: string;
  mentorName: string;
  departmentId: string;
  departmentName: string;
  programId?: string;
  programName?: string;
  status: 'ACTIVE' | 'REASSIGNED' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface AssignPayload {
  internId: string;
  mentorId: string;
  departmentId: string;
  programId?: string;
  startDate: string;
  endDate: string;
}

export interface ReassignPayload {
  internId: string;
  newMentorId: string;
  newDepartmentId?: string;
  reason: string;
}

export interface AssignmentHistory {
  id: string;
  action: 'ASSIGNED' | 'REASSIGNED' | 'UNASSIGNED' | 'COMPLETED';
  previousMentor?: string;
  newMentor?: string;
  previousDepartment?: string;
  newDepartment?: string;
  reason?: string;
  timestamp: string;
  performedBy: string;
}

export interface MentorCapacityInfo {
  mentorId: string;
  mentorName: string;
  currentCount: number;
  maxCapacity: number;
  available: boolean;
}
