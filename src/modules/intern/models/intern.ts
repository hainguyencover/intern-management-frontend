export type InternStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'REVIEWING' 
  | 'APPROVED' 
  | 'INTERNING' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'ONBOARDING'
  | 'ACTIVE';

export interface InternProfile {
  id: string | number;
  internCode?: string;
  studentCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  university: string;
  major: string;
  gpa?: number;
  status: InternStatus;
  avatarUrl?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  version?: number;
}

export interface CreateInternPayload {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  university: string;
  major: string;
  studentCode?: string;
  gpa?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateInternPayload extends Partial<CreateInternPayload> {
  status?: InternStatus;
  version?: number;
}

export interface InternQuery {
  page?: number;
  limit?: number;
  size?: number;
  search?: string;
  keyword?: string;
  status?: string;
  university?: string;
  major?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}
