export type MentorStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';

export interface Mentor {
  id: number;
  userId?: number;
  email?: string;
  fullName: string;
  phone?: string;
  employeeCode: string;
  departmentId?: number;
  departmentName?: string;
  position?: string;
  title?: string;
  specialization?: string;
  yearsOfExperience?: number;
  capacity: number;
  activeInternsCount: number;
  availableCapacity: number;
  capacityUtilizationPercentage: number;
  status: MentorStatus;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentorPayload {
  fullName: string;
  email: string;
  phone?: string;
  employeeCode: string;
  departmentId?: number;
  position?: string;
  title?: string;
  specialization?: string;
  yearsOfExperience?: number;
  capacity?: number;
  avatarUrl?: string;
  bio?: string;
  userId?: number;
  initialPassword?: string;
}

export interface UpdateMentorPayload {
  fullName?: string;
  phone?: string;
  departmentId?: number;
  position?: string;
  title?: string;
  specialization?: string;
  yearsOfExperience?: number;
  capacity?: number;
  status?: MentorStatus;
  avatarUrl?: string;
  bio?: string;
}

export interface MentorStatusUpdatePayload {
  status: MentorStatus;
  reason?: string;
  forceDeactivate?: boolean;
}

export interface MentorDashboardStats {
  totalInterns: number;
  activeInterns: number;
  completedInterns: number;
  pendingReports: number;
  overdueReports: number;
  pendingTasks: number;
  averageInternProgress: number;
  recentTasks?: any[];
  recentReports?: any[];
}
