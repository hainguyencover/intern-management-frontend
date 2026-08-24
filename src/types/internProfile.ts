export type InternStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED'
  | 'INTERNING'
  | 'COMPLETED';

export interface InternProfile {
  id: number;
  userId?: number;
  internCode: string;
  fullName: string;
  email: string;
  phone: string;
  university?: string;
  major?: string;
  gpa?: number;
  status: InternStatus;
  programId?: number;
  programName?: string;
  departmentId?: number;
  departmentName?: string;
  groupId?: number;
  groupName?: string;
  mentorId?: number;
  mentorName?: string;
  startDate?: string;
  endDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternProfileQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: InternStatus;
  programId?: number;
  departmentId?: number;
  mentorId?: number;
}

export interface CreateInternProfileRequest {
  fullName: string;
  email: string;
  phone: string;
  university?: string;
  major?: string;
  gpa?: number;
  programId?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface UpdateInternProfileRequest {
  fullName?: string;
  phone?: string;
  university?: string;
  major?: string;
  gpa?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
}

export interface StatusTransitionRequest {
  targetStatus: InternStatus;
  reason?: string;
}
