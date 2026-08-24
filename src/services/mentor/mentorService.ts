import apiClient from '@/services/api/apiClient';
import type { Mentor, CreateMentorRequest, MentorWorkload, MentorAssignmentRequest } from '@/types/mentor';
import type { InternProfile } from '@/types/internProfile';

export const mentorService = {
  async getMentors(): Promise<Mentor[]> {
    const { data } = await apiClient.get<Mentor[]>('/mentors');
    return data;
  },

  async getMentorById(id: number): Promise<Mentor> {
    const { data } = await apiClient.get<Mentor>(`/mentors/${id}`);
    return data;
  },

  async createMentor(req: CreateMentorRequest): Promise<Mentor> {
    const { data } = await apiClient.post<Mentor>('/mentors', req);
    return data;
  },

  async updateMentor(id: number, req: Partial<CreateMentorRequest>): Promise<Mentor> {
    const { data } = await apiClient.put<Mentor>(`/mentors/${id}`, req);
    return data;
  },

  async getMentorWorkload(mentorId: number): Promise<MentorWorkload> {
    const { data } = await apiClient.get<MentorWorkload>(`/mentors/${mentorId}/workload`);
    return data;
  },

  async assignIntern(req: MentorAssignmentRequest): Promise<InternProfile> {
    const { data } = await apiClient.put<InternProfile>(`/interns/profiles/${req.internProfileId}/assign-mentor`, {
      mentorId: req.mentorId,
      notes: req.notes
    });
    return data;
  }
};

export default mentorService;
