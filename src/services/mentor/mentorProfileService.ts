import apiClient from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type {
  MentorProfileDetail,
  UpdateMentorProfilePayload,
  AddMentorSkillPayload,
  MentorSkill,
  MentorExperience,
  MentorExperiencePayload,
  MentorCertification,
  MentorCertificationPayload,
  MentoringDomain,
  Skill,
  MentorMatchFilter,
  MentorMatchResult
} from '@/types/mentor';

export const mentorProfileService = {
  // Mentor self profile
  async getMyProfile(): Promise<MentorProfileDetail> {
    const { data } = await apiClient.get<ApiResponse<MentorProfileDetail>>('/mentors/me/profile');
    return data.data;
  },

  async updateMyProfile(payload: UpdateMentorProfilePayload): Promise<MentorProfileDetail> {
    const { data } = await apiClient.patch<ApiResponse<MentorProfileDetail>>('/mentors/me/profile', payload);
    return data.data;
  },

  // Skills
  async addMySkill(payload: AddMentorSkillPayload): Promise<MentorSkill> {
    const { data } = await apiClient.post<ApiResponse<MentorSkill>>('/mentors/me/skills', payload);
    return data.data;
  },

  async updateMySkill(skillId: number, payload: Partial<AddMentorSkillPayload>): Promise<MentorSkill> {
    const { data } = await apiClient.patch<ApiResponse<MentorSkill>>(`/mentors/me/skills/${skillId}`, payload);
    return data.data;
  },

  async removeMySkill(skillId: number): Promise<void> {
    await apiClient.delete(`/mentors/me/skills/${skillId}`);
  },

  // Experiences
  async addMyExperience(payload: MentorExperiencePayload): Promise<MentorExperience> {
    const { data } = await apiClient.post<ApiResponse<MentorExperience>>('/mentors/me/experiences', payload);
    return data.data;
  },

  async updateMyExperience(expId: number, payload: MentorExperiencePayload): Promise<MentorExperience> {
    const { data } = await apiClient.patch<ApiResponse<MentorExperience>>(`/mentors/me/experiences/${expId}`, payload);
    return data.data;
  },

  async removeMyExperience(expId: number): Promise<void> {
    await apiClient.delete(`/mentors/me/experiences/${expId}`);
  },

  // Certifications
  async addMyCertification(payload: MentorCertificationPayload): Promise<MentorCertification> {
    const { data } = await apiClient.post<ApiResponse<MentorCertification>>('/mentors/me/certifications', payload);
    return data.data;
  },

  async updateMyCertification(certId: number, payload: MentorCertificationPayload): Promise<MentorCertification> {
    const { data } = await apiClient.patch<ApiResponse<MentorCertification>>(`/mentors/me/certifications/${certId}`, payload);
    return data.data;
  },

  async removeMyCertification(certId: number): Promise<void> {
    await apiClient.delete(`/mentors/me/certifications/${certId}`);
  },

  // Domains
  async updateMyDomains(domainIds: number[]): Promise<MentoringDomain[]> {
    const { data } = await apiClient.put<ApiResponse<MentoringDomain[]>>('/mentors/me/domains', domainIds);
    return data.data;
  },

  // Catalog
  async getAvailableSkills(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>('/mentors/me/available-skills');
    return data.data;
  },

  async getAvailableDomains(): Promise<MentoringDomain[]> {
    const { data } = await apiClient.get<ApiResponse<MentoringDomain[]>>('/mentors/me/available-domains');
    return data.data;
  },

  // HR endpoints
  async getMentorProfileForHr(mentorId: number): Promise<MentorProfileDetail> {
    const { data } = await apiClient.get<ApiResponse<MentorProfileDetail>>(`/hr/mentors/${mentorId}/profile`);
    return data.data;
  },

  async matchMentorsForHr(filter: MentorMatchFilter): Promise<MentorMatchResult[]> {
    const { data } = await apiClient.post<ApiResponse<MentorMatchResult[]>>('/hr/mentors/match', filter);
    return data.data;
  }
};

export default mentorProfileService;
