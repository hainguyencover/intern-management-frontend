import apiClient from '@/services/api/apiClient';
import type {
  InternProfile,
  InternProfileQueryParams,
  CreateInternProfileRequest,
  UpdateInternProfileRequest,
  StatusTransitionRequest
} from '@/types/internProfile';
import type { PageResponse } from '@/types/user';

export const internProfileService = {
  async getInternProfiles(params: InternProfileQueryParams): Promise<PageResponse<InternProfile>> {
    const { data } = await apiClient.get<PageResponse<InternProfile>>('/interns/profiles', { params });
    return data;
  },

  async getInternProfileById(id: number): Promise<InternProfile> {
    const { data } = await apiClient.get<InternProfile>(`/interns/profiles/${id}`);
    return data;
  },

  async createInternProfile(req: CreateInternProfileRequest): Promise<InternProfile> {
    const { data } = await apiClient.post<InternProfile>('/interns/profiles', req);
    return data;
  },

  async updateInternProfile(id: number, req: UpdateInternProfileRequest): Promise<InternProfile> {
    const { data } = await apiClient.put<InternProfile>(`/interns/profiles/${id}`, req);
    return data;
  },

  async transitionStatus(id: number, req: StatusTransitionRequest): Promise<InternProfile> {
    const { data } = await apiClient.post<InternProfile>(`/interns/profiles/${id}/transition`, req);
    return data;
  },

  async assignMentor(internProfileId: number, mentorId: number): Promise<InternProfile> {
    const { data } = await apiClient.put<InternProfile>(`/interns/profiles/${internProfileId}/assign-mentor`, {
      mentorId
    });
    return data;
  }
};

export default internProfileService;
