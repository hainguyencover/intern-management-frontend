import apiClient from '@/services/api/apiClient';
import type {
  Program,
  Department,
  Group,
  ProgramQueryParams,
  ProgramRequest
} from '@/types/program';
import type { PageResponse } from '@/types/user';

export const programService = {
  async getPrograms(params: ProgramQueryParams): Promise<PageResponse<Program>> {
    const { data } = await apiClient.get<PageResponse<Program>>('/programs', { params });
    return data;
  },

  async getProgramById(id: number): Promise<Program> {
    const { data } = await apiClient.get<Program>(`/programs/${id}`);
    return data;
  },

  async createProgram(req: ProgramRequest): Promise<Program> {
    const { data } = await apiClient.post<Program>('/programs', req);
    return data;
  },

  async updateProgram(id: number, req: ProgramRequest): Promise<Program> {
    const { data } = await apiClient.put<Program>(`/programs/${id}`, req);
    return data;
  },

  async getDepartments(): Promise<Department[]> {
    const { data } = await apiClient.get<Department[]>('/departments');
    return data;
  },

  async getGroups(departmentId?: number): Promise<Group[]> {
    const { data } = await apiClient.get<Group[]>('/groups', {
      params: { departmentId }
    });
    return data;
  }
};

export default programService;
