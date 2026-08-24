import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import mentorProfileService from '@/services/mentor/mentorProfileService';
import type {
  MentorProfileDetail,
  UpdateMentorProfilePayload,
  AddMentorSkillPayload,
  MentorExperiencePayload,
  MentorCertificationPayload,
  Skill,
  MentoringDomain
} from '@/types/mentor';

export const useMentorProfileStore = defineStore('mentorProfile', () => {
  const profile = ref<MentorProfileDetail | null>(null);
  const availableSkills = ref<Skill[]>([]);
  const availableDomains = ref<MentoringDomain[]>([]);
  const loading = ref<boolean>(false);
  const saving = ref<boolean>(false);
  const isDirty = ref<boolean>(false);

  const isProfileComplete = computed(() => profile.value?.profileStatus === 'COMPLETED');

  async function fetchMyProfile() {
    loading.value = true;
    try {
      const [prof, skills, domains] = await Promise.all([
        mentorProfileService.getMyProfile(),
        mentorProfileService.getAvailableSkills(),
        mentorProfileService.getAvailableDomains()
      ]);
      profile.value = prof;
      availableSkills.value = skills;
      availableDomains.value = domains;
      isDirty.value = false;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(payload: UpdateMentorProfilePayload) {
    saving.value = true;
    try {
      const updated = await mentorProfileService.updateMyProfile(payload);
      profile.value = updated;
      isDirty.value = false;
    } finally {
      saving.value = false;
    }
  }

  async function addSkill(payload: AddMentorSkillPayload) {
    saving.value = true;
    try {
      await mentorProfileService.addMySkill(payload);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function removeSkill(skillId: number) {
    saving.value = true;
    try {
      await mentorProfileService.removeMySkill(skillId);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function addExperience(payload: MentorExperiencePayload) {
    saving.value = true;
    try {
      await mentorProfileService.addMyExperience(payload);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function removeExperience(expId: number) {
    saving.value = true;
    try {
      await mentorProfileService.removeMyExperience(expId);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function addCertification(payload: MentorCertificationPayload) {
    saving.value = true;
    try {
      await mentorProfileService.addMyCertification(payload);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function removeCertification(certId: number) {
    saving.value = true;
    try {
      await mentorProfileService.removeMyCertification(certId);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  async function updateDomains(domainIds: number[]) {
    saving.value = true;
    try {
      await mentorProfileService.updateMyDomains(domainIds);
      await fetchMyProfile();
    } finally {
      saving.value = false;
    }
  }

  function markDirty() {
    isDirty.value = true;
  }

  function resetDirty() {
    isDirty.value = false;
  }

  return {
    profile,
    availableSkills,
    availableDomains,
    loading,
    saving,
    isDirty,
    isProfileComplete,
    fetchMyProfile,
    updateProfile,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    addCertification,
    removeCertification,
    updateDomains,
    markDirty,
    resetDirty
  };
});
