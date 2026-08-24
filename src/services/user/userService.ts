import apiClient from '@/services/api/apiClient';
import type {
  UserQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  Role,
  Permission,
  PageResponse
} from '@/types/user';
import type { User } from '@/types/auth';

export const userService = {
  async getUsers(params: UserQueryParams): Promise<PageResponse<User>> {
    const { data } = await apiClient.get<PageResponse<User>>('/users', { params });
    return data;
  },

  async getUserById(id: number): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async createUser(req: CreateUserRequest): Promise<User> {
    const { data } = await apiClient.post<User>('/users', req);
    return data;
  },

  async updateUser(id: number, req: UpdateUserRequest): Promise<User> {
    const { data } = await apiClient.put<User>(`/users/${id}`, req);
    return data;
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async toggleStatus(id: number, status: string): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${id}/status`, { status });
    return data;
  },

  async getRoles(): Promise<Role[]> {
    const { data } = await apiClient.get<Role[]>('/roles');
    return data;
  },

  async getPermissions(): Promise<Permission[]> {
    const { data } = await apiClient.get<Permission[]>('/permissions');
    return data;
  }
};

export default userService;
