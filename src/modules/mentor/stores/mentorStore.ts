import { defineStore } from 'pinia';
import { ref } from 'vue';
import { mentorApi } from '../api/mentorApi';
import { mentorAssignmentApi } from '../api/mentorAssignmentApi';
import type { Mentor, MentorStatus } from '../types/mentor';
import type { MentorAssignment } from '../types/mentorAssignment';

export const useMentorStore = defineStore('mentor', () => {
  const mentors = ref<Mentor[]>([]);
  const totalMentors = ref(0);
  const loading = ref(false);
  const selectedMentor = ref<Mentor | null>(null);
  const activeInterns = ref<MentorAssignment[]>([]);
  const assignmentHistory = ref<MentorAssignment[]>([]);

  async function fetchMentors(params?: { search?: string; status?: MentorStatus; departmentId?: number; page?: number; size?: number }) {
    loading.value = true;
    try {
      const res: any = await mentorApi.searchMentors(params);
      if (res?.data?.content) {
        mentors.value = res.data.content;
        totalMentors.value = res.data.totalElements || res.data.content.length;
      } else if (res?.content) {
        mentors.value = res.content;
        totalMentors.value = res.totalElements || res.content.length;
      }
    } finally {
      loading.value = false;
    }
  }

  async function fetchMentorDetail(id: number) {
    loading.value = true;
    try {
      const res: any = await mentorApi.getMentorById(id);
      selectedMentor.value = res?.data || res;
      return selectedMentor.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMentorActiveInterns(mentorId: number) {
    try {
      const res: any = await mentorAssignmentApi.getMentorActiveInterns(mentorId);
      activeInterns.value = res?.data || res || [];
    } catch {
      activeInterns.value = [];
    }
  }

  async function fetchInternMentorHistory(internId: number) {
    try {
      const res: any = await mentorAssignmentApi.getInternMentorHistory(internId);
      assignmentHistory.value = res?.data || res || [];
    } catch {
      assignmentHistory.value = [];
    }
  }

  return {
    mentors,
    totalMentors,
    loading,
    selectedMentor,
    activeInterns,
    assignmentHistory,
    fetchMentors,
    fetchMentorDetail,
    fetchMentorActiveInterns,
    fetchInternMentorHistory,
  };
});
