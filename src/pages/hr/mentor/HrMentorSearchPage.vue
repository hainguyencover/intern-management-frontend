<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="max-width-container margin-auto">
      <!-- Title Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-h5 text-bold text-primary">Tra cứu & Matching Mentor</div>
          <div class="text-caption text-grey-7">
            Tìm kiếm Mentor phù hợp theo kỹ năng, kinh nghiệm và dung lượng capacity thực tế
          </div>
        </div>
      </div>

      <!-- Filter Controls Card -->
      <q-card flat bordered class="q-pa-md q-mb-md rounded-borders bg-white">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filter.keyword"
              label="Từ khóa (Họ tên, Chức danh...)"
              outlined
              dense
              clearable
              @keyup.enter="handleSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4">
            <q-input
              v-model="filter.skill"
              label="Kỹ năng yêu cầu (e.g. Java, Vue)"
              outlined
              dense
              clearable
            />
          </div>

          <div class="col-12 col-sm-4">
            <q-input
              v-model="filter.domain"
              label="Lĩnh vực thực tập"
              outlined
              dense
              clearable
            />
          </div>

          <div class="col-12 col-sm-3">
            <q-input
              v-model.number="filter.minExperience"
              type="number"
              label="Kinh nghiệm tối thiểu (năm)"
              outlined
              dense
              min="0"
            />
          </div>

          <div class="col-12 col-sm-4">
            <q-checkbox
              v-model="filter.availableCapacityOnly"
              label="Chỉ hiển thị Mentor còn trống capacity"
            />
          </div>

          <div class="col-12 col-sm-5 row justify-end gap-2">
            <q-btn flat label="Đặt lại" color="grey" @click="handleReset" />
            <q-btn color="primary" icon="search" label="Tìm kiếm & Matching" unelevated :loading="loading" @click="handleSearch" />
          </div>
        </div>
      </q-card>

      <!-- Match Results List -->
      <div v-if="loading" class="row justify-center q-py-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="results.length === 0" class="text-center q-py-xl text-grey-6">
        <q-icon name="group_off" size="48px" class="q-mb-sm" />
        <div>Không tìm thấy Mentor phù hợp với tiêu chí lọc.</div>
      </div>

      <div v-else class="q-gutter-y-md">
        <q-card
          v-for="item in results"
          :key="item.mentor.id"
          flat
          bordered
          class="q-pa-md rounded-borders bg-white shadow-1 transition-hover"
        >
          <div class="row items-start justify-between wrap gap-4">
            <!-- Left Info -->
            <div class="row items-start gap-4">
              <q-avatar size="60px" color="primary" text-color="white" class="shadow-1">
                <img v-if="item.mentor.avatarUrl" :src="item.mentor.avatarUrl" />
                <span v-else class="text-h6 text-bold">{{ getInitials(item.mentor.fullName) }}</span>
              </q-avatar>

              <div>
                <div class="row items-center gap-2">
                  <span class="text-h6 text-bold text-dark">{{ item.mentor.fullName }}</span>
                  <q-badge color="grey-7" class="text-bold">{{ item.mentor.employeeCode }}</q-badge>
                  <q-badge
                    :color="item.mentor.profileStatus === 'COMPLETED' ? 'positive' : 'warning'"
                    :label="item.mentor.profileStatus === 'COMPLETED' ? 'Profile Đầy đủ' : 'Profile Chưa đầy đủ'"
                  />
                </div>

                <div class="text-subtitle2 text-grey-8 q-mt-xs">
                  {{ item.mentor.jobTitle || 'Chưa cập nhật vị trí' }} • {{ item.mentor.departmentName || 'Chưa phân phòng' }}
                </div>

                <div class="row items-center gap-4 text-caption text-grey-7 q-mt-xs">
                  <span><q-icon name="work_history" /> {{ item.mentor.yearsOfExperience || 0 }} năm kinh nghiệm</span>
                  <span><q-icon name="school" /> {{ item.mentor.mentoringExperienceYears || 0 }} năm hướng dẫn</span>
                  <span>
                    <q-icon name="people" /> {{ item.mentor.currentInternCount }}/{{ item.mentor.maxInterns }} TTS
                    (Còn {{ item.mentor.availableCapacity }} slot)
                  </span>
                </div>

                <!-- Skills & Domains Chips -->
                <div class="row items-center gap-1 q-mt-sm">
                  <span class="text-caption text-bold text-grey-8">Kỹ năng:</span>
                  <q-badge
                    v-for="sk in item.mentor.skills"
                    :key="sk.id"
                    color="blue-2"
                    text-color="blue-9"
                    class="q-px-xs"
                  >
                    {{ sk.name }} ({{ sk.proficiencyLevel }})
                  </q-badge>
                  <span v-if="!item.mentor.skills || item.mentor.skills.length === 0" class="text-caption text-italic text-grey-6">Chưa có</span>
                </div>
              </div>
            </div>

            <!-- Right Matching Score Badge -->
            <div class="flex flex-col items-end">
              <div class="row items-center gap-2">
                <span class="text-caption text-grey-7 text-bold">Match Score:</span>
                <q-badge
                  :color="getScoreColor(item.matchPercentage)"
                  class="text-h6 text-bold q-px-md q-py-xs shadow-1"
                >
                  {{ item.matchPercentage }}%
                </q-badge>
              </div>

              <div class="text-caption text-grey-6 q-mt-xs text-right" style="max-width: 250px">
                {{ item.matchReason }}
              </div>

              <q-btn
                outline
                color="primary"
                icon="visibility"
                label="Xem hồ sơ chi tiết"
                dense
                class="q-mt-sm"
                @click="openDetailDialog(item.mentor)"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Dialog Chi tiết Hồ sơ Mentor -->
      <q-dialog v-model="showDetailModal" custom-class="max-modal-width">
        <q-card style="width: 700px; max-width: 90vw" v-if="selectedMentor">
          <q-card-section class="row items-center bg-primary text-white">
            <div class="text-h6">Hồ sơ Năng lực Mentor: {{ selectedMentor.fullName }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Chức danh / Vị trí:</div>
                <div class="text-subtitle1 text-bold">{{ selectedMentor.jobTitle || 'Chưa cập nhật' }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Phòng ban:</div>
                <div class="text-subtitle1 text-bold">{{ selectedMentor.departmentName || 'Chưa cập nhật' }}</div>
              </div>
              <div class="col-12">
                <div class="text-caption text-grey-7">Giới thiệu:</div>
                <div class="text-body2 bg-grey-2 q-pa-sm rounded-borders">{{ selectedMentor.bio || 'Chưa có giới thiệu' }}</div>
              </div>
            </div>

            <!-- Skills -->
            <div class="text-subtitle2 text-bold text-primary q-mt-md">Kỹ năng chuyên môn</div>
            <div class="row q-gutter-xs q-mt-xs">
              <q-chip
                v-for="sk in selectedMentor.skills"
                :key="sk.id"
                color="purple-1"
                text-color="purple-9"
              >
                {{ sk.name }} - {{ sk.proficiencyLevel }} ({{ sk.yearsOfExperience }} năm)
              </q-chip>
            </div>

            <!-- Experiences -->
            <div class="text-subtitle2 text-bold text-primary q-mt-md">Kinh nghiệm làm việc</div>
            <q-list bordered separator class="rounded-borders q-mt-xs" v-if="selectedMentor.experiences.length > 0">
              <q-item v-for="exp in selectedMentor.experiences" :key="exp.id">
                <q-item-section>
                  <q-item-label class="text-bold">{{ exp.position }} @ {{ exp.companyName }}</q-item-label>
                  <q-item-label caption>{{ exp.startDate }} - {{ exp.isCurrent ? 'Hiện tại' : exp.endDate }}</q-item-label>
                  <q-item-label caption v-if="exp.description">{{ exp.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-caption text-grey-6 text-italic">Chưa có thông tin kinh nghiệm</div>

            <!-- Certifications -->
            <div class="text-subtitle2 text-bold text-primary q-mt-md">Chứng chỉ</div>
            <div class="row q-gutter-xs q-mt-xs">
              <q-badge v-for="cert in selectedMentor.certifications" :key="cert.id" color="teal" class="q-pa-xs">
                {{ cert.name }} ({{ cert.issuingOrganization }})
              </q-badge>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import mentorProfileService from '@/services/mentor/mentorProfileService';
import type { MentorMatchFilter, MentorMatchResult, MentorProfileDetail } from '@/types/mentor';

const loading = ref(false);
const results = ref<MentorMatchResult[]>([]);
const showDetailModal = ref(false);
const selectedMentor = ref<MentorProfileDetail | null>(null);

const filter = reactive<MentorMatchFilter>({
  keyword: '',
  skill: '',
  domain: '',
  minExperience: undefined,
  availableCapacityOnly: false
});

onMounted(() => {
  handleSearch();
});

async function handleSearch() {
  loading.value = true;
  try {
    results.value = await mentorProfileService.matchMentorsForHr({
      keyword: filter.keyword,
      skill: filter.skill,
      domain: filter.domain,
      minExperience: filter.minExperience,
      availableCapacityOnly: filter.availableCapacityOnly
    });
  } catch (err) {
    console.error('Match mentors error', err);
  } finally {
    loading.value = false;
  }
}

function handleReset() {
  filter.keyword = '';
  filter.skill = '';
  filter.domain = '';
  filter.minExperience = undefined;
  filter.availableCapacityOnly = false;
  handleSearch();
}

function getInitials(name?: string): string {
  if (!name) return 'M';
  const parts = name.trim().split(' ');
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'positive';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'orange-8';
  return 'grey-7';
}

function openDetailDialog(mentor: MentorProfileDetail) {
  selectedMentor.value = mentor;
  showDetailModal.value = true;
}
</script>

<style scoped>
.max-width-container {
  max-width: 1100px;
}
.margin-auto {
  margin: 0 auto;
}
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}
.transition-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.transition-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
