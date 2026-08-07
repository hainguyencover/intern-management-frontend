export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  internCount: number;
  createdAt: string;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface DepartmentListResponse {
  items: Department[];
  total: number;
  page: number;
  limit: number;
}
