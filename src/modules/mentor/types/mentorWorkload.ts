export type MentorWorkloadStatus =
  | 'NO_ASSIGNMENT'
  | 'UNDERLOAD'
  | 'NORMAL'
  | 'NEAR_CAPACITY'
  | 'OVERLOAD';

export interface MentorWorkload {
  mentorId: number;
  userId: number | null;
  employeeCode: string;
  mentorName: string;
  email: string | null;
  phone: string | null;
  departmentId: number | null;
  departmentName: string | null;
  position: string | null;
  specialization: string | null;
  currentInternCount: number;
  maxInternCapacity: number;
  utilizationPercent: number;
  workloadStatus: MentorWorkloadStatus;
  lastUpdatedAt: string;
}

export interface MentorWorkloadSummary {
  totalMentors: number;
  mentorsWithInterns: number;
  totalActiveInterns: number;
  averageInternsPerMentor: number;
  noAssignmentCount: number;
  underloadCount: number;
  normalCount: number;
  nearCapacityCount: number;
  overloadCount: number;
}

export interface MentorActiveIntern {
  assignmentId: number;
  internId: number;
  internCode: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  university: string | null;
  programName: string | null;
  assignmentType: string;
  status: string;
  startDate: string;
  endDate: string | null;
  assignedAt: string;
  note: string | null;
}

export interface WorkloadFilterParams {
  page?: number;
  size?: number;
  keyword?: string;
  departmentId?: number | null;
  workloadStatus?: MentorWorkloadStatus | null;
}
