<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="max-width-container margin-auto">
      <!-- Loading State -->
      <div v-if="store.loading" class="row justify-center q-py-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <template v-else-if="store.profile">
        <!-- Top Header Card -->
        <q-card flat bordered class="q-pa-md q-mb-md rounded-borders bg-white">
          <div class="row items-center justify-between wrap gap-4">
            <div class="row items-center gap-4">
              <q-avatar size="72px" color="primary" text-color="white" class="shadow-2">
                <img v-if="store.profile.avatarUrl" :src="store.profile.avatarUrl" />
                <span v-else class="text-h5 text-bold">{{ getInitials(store.profile.fullName) }}</span>
              </q-avatar>
              <div>
                <div class="row items-center gap-2">
                  <span class="text-h5 text-bold text-dark">{{ store.profile.fullName }}</span>
                  <q-badge
                    :color="store.profile.profileStatus === 'COMPLETED' ? 'positive' : 'warning'"
                    :label="store.profile.profileStatus === 'COMPLETED' ? 'Hồ sơ Hoàn tất' : 'Hồ sơ Bản nháp'"
                    class="q-px-sm q-py-xs text-weight-bold"
                  />
                </div>
                <div class="text-subtitle2 text-grey-7">
                  {{ store.profile.jobTitle || 'Chưa cập nhật chức danh' }} • {{ store.profile.departmentName || 'Chưa phân phòng ban' }}
                </div>
                <div class="text-caption text-grey-6">Mã nhân viên: {{ store.profile.employeeCode }}</div>
              </div>
            </div>

            <!-- Capacity Info Card -->
            <q-card flat class="bg-blue-1 border-blue q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8 text-bold">Tải công việc & Slot nhận TTS</div>
              <div class="row items-center q-gutter-x-md q-mt-xs">
                <div class="text-center">
                  <div class="text-h6 text-primary text-bold">{{ store.profile.maxInterns }}</div>
                  <div class="text-caption text-grey-7">Tối đa</div>
                </div>
                <q-separator vertical />
                <div class="text-center">
                  <div class="text-h6 text-orange-9 text-bold">{{ store.profile.currentInternCount }}</div>
                  <div class="text-caption text-grey-7">Đang hướng dẫn</div>
                </div>
                <q-separator vertical />
                <div class="text-center">
                  <div class="text-h6 text-positive text-bold">{{ store.profile.availableCapacity }}</div>
                  <div class="text-caption text-grey-7">Còn trống</div>
                </div>
              </div>
            </q-card>
          </div>
        </q-card>

        <!-- Form Chỉnh sửa thông tin chuyên môn -->
        <q-card flat bordered class="q-pa-md q-mb-md rounded-borders bg-white">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-primary flex items-center gap-2">
              <q-icon name="person" size="24px" />
              <span>Thông tin Chuyên môn & Định danh</span>
            </div>
            <q-btn
              color="primary"
              icon="save"
              label="Lưu thông tin"
              unelevated
              :loading="store.saving"
              @click="handleSaveMainForm"
            />
          </div>

          <q-form class="q-gutter-y-sm">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.fullName"
                  label="Họ và tên *"
                  outlined
                  dense
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.jobTitle"
                  label="Chức danh / Vị trí *"
                  outlined
                  dense
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.specialization"
                  label="Chuyên môn sâu"
                  outlined
                  dense
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12 col-sm-3">
                <q-input
                  v-model.number="form.yearsOfExperience"
                  type="number"
                  label="Tổng số năm EXP *"
                  outlined
                  dense
                  min="0"
                  max="60"
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12 col-sm-3">
                <q-input
                  v-model.number="form.mentoringExperienceYears"
                  type="number"
                  label="EXP Hướng dẫn (năm) *"
                  outlined
                  dense
                  min="0"
                  max="60"
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="form.maxInterns"
                  type="number"
                  label="Số lượng TTS tối đa có thể nhận *"
                  outlined
                  dense
                  min="1"
                  max="100"
                  @update:model-value="store.markDirty"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.bio"
                  type="textarea"
                  label="Giới thiệu bản thân & Định hướng hướng dẫn"
                  outlined
                  dense
                  rows="3"
                  @update:model-value="store.markDirty"
                />
              </div>
            </div>
          </q-form>
        </q-card>

        <!-- Kỹ năng & Chuyên môn Component -->
        <MentorSkillEditor
          :skills="store.profile.skills"
          :available-skills="store.availableSkills"
          @add-skill="handleAddSkill"
          @remove-skill="handleRemoveSkill"
        />

        <!-- Lĩnh vực hướng dẫn Component -->
        <MentorDomainSelector
          :domains="store.profile.domains"
          :available-domains="store.availableDomains"
          :saving="store.saving"
          @update-domains="handleUpdateDomains"
        />

        <!-- Kinh nghiệm làm việc Component -->
        <MentorExperienceEditor
          :experiences="store.profile.experiences"
          @add-experience="handleAddExperience"
          @remove-experience="handleRemoveExperience"
        />

        <!-- Chứng chỉ chuyên môn Component -->
        <MentorCertificationEditor
          :certifications="store.profile.certifications"
          @add-certification="handleAddCertification"
          @remove-certification="handleRemoveCertification"
        />
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useMentorProfileStore } from '@/stores/mentorProfileStore';
import MentorSkillEditor from '@/components/mentor/MentorSkillEditor.vue';
import MentorDomainSelector from '@/components/mentor/MentorDomainSelector.vue';
import MentorExperienceEditor from '@/components/mentor/MentorExperienceEditor.vue';
import MentorCertificationEditor from '@/components/mentor/MentorCertificationEditor.vue';
import type { AddMentorSkillPayload, MentorExperiencePayload, MentorCertificationPayload } from '@/types/mentor';

const $q = useQuasar();
const store = useMentorProfileStore();

const form = reactive({
  fullName: '',
  jobTitle: '',
  specialization: '',
  yearsOfExperience: 0,
  mentoringExperienceYears: 0,
  maxInterns: 5,
  bio: ''
});

onMounted(async () => {
  await store.fetchMyProfile();
});

watch(
  () => store.profile,
  (prof) => {
    if (prof) {
      form.fullName = prof.fullName || '';
      form.jobTitle = prof.jobTitle || '';
      form.specialization = prof.specialization || '';
      form.yearsOfExperience = prof.yearsOfExperience ? Number(prof.yearsOfExperience) : 0;
      form.mentoringExperienceYears = prof.mentoringExperienceYears || 0;
      form.maxInterns = prof.maxInterns || 5;
      form.bio = prof.bio || '';
    }
  },
  { immediate: true }
);

function getInitials(name?: string): string {
  if (!name) return 'M';
  const parts = name.trim().split(' ');
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

async function handleSaveMainForm() {
  try {
    await store.updateProfile({
      fullName: form.fullName,
      jobTitle: form.jobTitle,
      specialization: form.specialization,
      yearsOfExperience: form.yearsOfExperience,
      mentoringExperienceYears: form.mentoringExperienceYears,
      maxInterns: form.maxInterns,
      bio: form.bio
    });
    $q.notify({ type: 'positive', message: 'Cập nhật thông tin hồ sơ thành công!' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể lưu thông tin hồ sơ' });
  }
}

async function handleAddSkill(payload: AddMentorSkillPayload) {
  try {
    await store.addSkill(payload);
    $q.notify({ type: 'positive', message: 'Đã thêm kỹ năng mới!' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Thêm kỹ năng thất bại' });
  }
}

async function handleRemoveSkill(skillId: number) {
  try {
    await store.removeSkill(skillId);
    $q.notify({ type: 'info', message: 'Đã xóa kỹ năng' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể xóa kỹ năng' });
  }
}

async function handleAddExperience(payload: MentorExperiencePayload) {
  try {
    await store.addExperience(payload);
    $q.notify({ type: 'positive', message: 'Đã thêm kinh nghiệm làm việc!' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Thêm kinh nghiệm thất bại' });
  }
}

async function handleRemoveExperience(expId: number) {
  try {
    await store.removeExperience(expId);
    $q.notify({ type: 'info', message: 'Đã xóa kinh nghiệm làm việc' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể xóa kinh nghiệm' });
  }
}

async function handleAddCertification(payload: MentorCertificationPayload) {
  try {
    await store.addCertification(payload);
    $q.notify({ type: 'positive', message: 'Đã thêm chứng chỉ mới!' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Thêm chứng chỉ thất bại' });
  }
}

async function handleRemoveCertification(certId: number) {
  try {
    await store.removeCertification(certId);
    $q.notify({ type: 'info', message: 'Đã xóa chứng chỉ' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể xóa chứng chỉ' });
  }
}

async function handleUpdateDomains(domainIds: number[]) {
  try {
    await store.updateDomains(domainIds);
    $q.notify({ type: 'positive', message: 'Cập nhật lĩnh vực hướng dẫn thành công!' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Cập nhật lĩnh vực thất bại' });
  }
}
</script>

<style scoped>
.max-width-container {
  max-width: 1100px;
}
.margin-auto {
  margin: 0 auto;
}
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}
.border-blue {
  border: 1px solid #90caf9;
}
</style>
