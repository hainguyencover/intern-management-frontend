export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  password?: string;
  role: string;
  department?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: string;
  department?: string;
  phone?: string;
  status?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
}
