export interface InternProfile {
  id: string;
  internCode: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  gpa?: number;
  status: 'APPLIED' | 'INTERNING' | 'COMPLETED' | 'TERMINATED';
  avatarUrl?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateInternPayload {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  gpa?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateInternPayload extends Partial<CreateInternPayload> {
  status?: 'APPLIED' | 'INTERNING' | 'COMPLETED' | 'TERMINATED';
}

export interface InternQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  university?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}
