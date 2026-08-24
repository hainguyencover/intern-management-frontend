export interface Program {
  id: number;
  code: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  currentCount: number;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  activeCount?: number;
}

export interface Group {
  id: number;
  departmentId: number;
  name: string;
  mentorCount?: number;
  internCount?: number;
}

export interface ProgramQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

export interface ProgramRequest {
  code: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}
