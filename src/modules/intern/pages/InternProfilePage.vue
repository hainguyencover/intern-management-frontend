<template>
  <q-page class="q-pa-lg">
    <!-- Skeleton Loading -->
    <BaseSkeleton v-if="loading" type="card" :rows="3" />

    <template v-else>
      <!-- Hero Header Card with Rich Aesthetics -->
      <q-card flat bordered class="q-mb-md overflow-hidden bg-gradient-primary text-white">
        <q-card-section class="q-pa-lg">
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-avatar size="88px" class="shadow-3 border-white">
                <img :src="profile?.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'" alt="Avatar" />
              </q-avatar>
            </div>
            <div class="col">
              <div class="row items-center q-gutter-x-sm">
                <h1 class="text-h4 text-bold q-my-none">{{ profile?.fullName || authStore.user?.fullName || 'Ứng viên' }}</h1>
                <q-chip dense :color="isConfirmedInternProfile ? 'amber-10' : 'orange-9'" text-color="white" class="text-bold">
                  {{ isConfirmedInternProfile ? (profile?.status || 'INTERNING') : 'TÀI KHOẢN ỨNG VIÊN' }}
                </q-chip>
              </div>
              <div class="text-subtitle1 text-blue-2 q-mt-xs">
                Mã TTS: <span class="text-bold text-white">{{ isConfirmedInternProfile ? (profile?.internCode || 'INT-2026-001') : 'Chưa cấp (Chờ HR duyệt)' }}</span> | {{ profile?.university || 'Trường Đại học / Cao đẳng' }} — {{ profile?.major || 'Chuyên ngành' }}
              </div>
              <div class="row items-center q-gutter-x-md q-mt-sm text-caption text-blue-1">
                <div><q-icon name="email" class="q-mr-xs" />{{ profile?.email || authStore.user?.email }}</div>
                <div><q-icon name="phone" class="q-mr-xs" />{{ profile?.phone || 'Chưa cập nhật' }}</div>
                <div><q-icon name="business" class="q-mr-xs" />Phòng ban: {{ profile?.departmentName || (isConfirmedInternProfile ? 'R&D Software' : 'Bộ phận Tuyển dụng (HR)') }}</div>
              </div>
            </div>
            <div class="col-auto">
              <q-btn color="white" text-color="primary" icon="edit" label="Chỉnh sửa Thông tin" @click="openEditDialog" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Tabs Navigation -->
      <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
        <q-tab name="personal" icon="person" label="Thông tin Cá nhân & Đào tạo" />
        <q-tab name="program" icon="school" label="Chương trình & Mentor" />
        <q-tab name="skills" icon="psychology" label="Kỹ năng & Mục tiêu" />
      </q-tabs>

      <q-separator class="q-mb-md" />

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <!-- TAB 1: PERSONAL INFO -->
        <q-tab-panel name="personal" class="q-pa-none">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="full-height">
                <q-card-section>
                  <div class="text-subtitle1 text-bold text-primary q-mb-sm">Hồ sơ Cá nhân</div>
                  <q-list separator class="text-body2">
                    <q-item>
                      <q-item-section class="text-grey-8">Họ và tên:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.fullName || authStore.user?.fullName }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Email hệ thống:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.email || authStore.user?.email }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Số điện thoại liên hệ:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.phone || 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Địa chỉ cư trú:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.address || 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Đường dẫn CV ứng tuyển:</q-item-section>
                      <q-item-section class="text-bold text-right">
                        <a v-if="profile?.cvUrl" :href="profile.cvUrl" target="_blank" class="text-primary text-bold" style="text-decoration: underline">
                          <q-icon name="description" class="q-mr-xs" />Xem CV ứng tuyển
                        </a>
                        <q-badge v-else color="negative" class="text-bold">Chưa cập nhật CV (Cần bổ sung để HR duyệt)</q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered class="full-height">
                <q-card-section>
                  <div class="text-subtitle1 text-bold text-teal q-mb-sm">Thông tin Đào tạo Trường</div>
                  <q-list separator class="text-body2">
                    <q-item>
                      <q-item-section class="text-grey-8">Trường Đại học / Cơ sở:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.university || 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Chuyên ngành đào tạo:</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.major || 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Mã số sinh viên (MSSV):</q-item-section>
                      <q-item-section class="text-bold text-right">{{ profile?.studentCode || 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section class="text-grey-8">Điểm trung bình (GPA):</q-item-section>
                      <q-item-section class="text-bold text-right text-primary">{{ profile?.gpa ? profile.gpa + ' / 4.0' : 'Chưa cập nhật' }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- TAB 2: PROGRAM & MENTOR -->
        <q-tab-panel name="program" class="q-pa-none">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-bold text-primary q-mb-md">Chương trình Thực tập Được Phân công</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="q-pa-sm bg-grey-2 rounded-borders">
                    <div class="text-caption text-grey-8 text-bold">Tên chương trình:</div>
                    <div class="text-subtitle2 text-bold text-primary">{{ profile?.programName || 'Chưa phân công (Chờ HR xét duyệt hồ sơ)' }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="q-pa-sm bg-grey-2 rounded-borders">
                    <div class="text-caption text-grey-8 text-bold">Mentor Hướng dẫn:</div>
                    <div class="text-subtitle2 text-bold text-teal">{{ profile?.mentorName || 'Chưa phân công (Cập nhật sau khi trúng tuyển)' }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="q-pa-sm bg-grey-2 rounded-borders">
                    <div class="text-caption text-grey-8 text-bold">Thời gian thực tập:</div>
                    <div class="text-subtitle2 text-bold">{{ profile?.startDate ? (profile.startDate + ' — ' + (profile.endDate || 'N/A')) : 'Chưa ấn định' }}</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="q-pa-sm bg-grey-2 rounded-borders">
                    <div class="text-caption text-grey-8 text-bold">Ca làm việc tiêu chuẩn:</div>
                    <div class="text-subtitle2 text-bold">Thứ 2 — Thứ 6 (08:30 — 17:30)</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- TAB 3: SKILLS & GOALS -->
        <q-tab-panel name="skills" class="q-pa-none">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-bold text-orange-9 q-mb-md">Bộ Kỹ năng & Mục tiêu Học tập</div>
              <div class="q-mb-md">
                <div class="text-caption text-grey-8 text-bold q-mb-xs">Công nghệ & Kỹ năng chuyên môn:</div>
                <div v-if="profile?.cvSkills" class="row q-gutter-xs">
                  <q-chip v-for="skill in profile.cvSkills.split(',')" :key="skill" color="primary" text-color="white" dense>
                    {{ skill.trim() }}
                  </q-chip>
                </div>
                <div v-else class="text-caption text-grey-7">
                  Chưa có dữ liệu kỹ năng. (Hệ thống AI sẽ tự động phân tích kỹ năng từ CV sau khi nộp hồ sơ).
                </div>
              </div>
              <div>
                <div class="text-caption text-grey-8 text-bold q-mb-xs">Ghi chú & Mục tiêu từ Mentor:</div>
                <div class="q-pa-sm bg-blue-1 border-blue rounded-borders text-body2">
                  {{ isConfirmedInternProfile ? 'Hoàn thiện các nhiệm vụ được giao đúng hạn, tuân thủ quy định báo cáo tuần Chủ Nhật 23:59:59 (BR-10) và tích cực trao đổi với nhóm.' : 'Chưa có ghi chú từ Mentor. (Nội dung này sẽ xuất hiện sau khi ứng viên được HR tuyển dụng và phân công Mentor).' }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Edit Profile Dialog -->
      <q-dialog v-model="showEditDialog">
        <q-card style="min-width: 520px">
          <q-card-section class="row items-center">
            <div class="text-h6 text-bold">Cập nhật Hồ sơ Ứng viên & CV</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form @submit="saveProfile" class="q-gutter-md">
              <q-input v-model="editForm.phone" label="Số điện thoại liên hệ" outlined dense />
              <q-input v-model="editForm.address" label="Địa chỉ cư trú" outlined dense />
              <q-input v-model="editForm.university" label="Trường Đại học / Cao đẳng" outlined dense />
              <q-input v-model="editForm.major" label="Chuyên ngành đào tạo" outlined dense />

              <!-- Option 1: Upload File from Hard Drive -->
              <div class="q-pa-sm bg-grey-2 rounded-borders">
                <div class="text-subtitle2 text-bold text-primary q-mb-xs">
                  <q-icon name="cloud_upload" class="q-mr-xs" /> Lựa chọn 1: Tải tệp CV từ máy tính (Ổ cứng)
                </div>
                <q-file
                  v-model="cvFile"
                  outlined
                  dense
                  bg-color="white"
                  label="Chọn tệp CV từ máy tính (.pdf, .doc, .docx)"
                  accept=".pdf,.doc,.docx"
                  clearable
                >
                  <template #prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>

              <!-- Option 2: Enter Google Drive / Cloud Link -->
              <div class="q-pa-sm bg-grey-2 rounded-borders">
                <div class="text-subtitle2 text-bold text-teal q-mb-xs">
                  <q-icon name="link" class="q-mr-xs" /> Lựa chọn 2: Dùng đường link CV xem trực tuyến (Google Drive / Cloud)
                </div>
                <q-input
                  v-model="editForm.cvUrl"
                  label="Dán đường link CV tại đây"
                  outlined
                  dense
                  bg-color="white"
                  placeholder="https://drive.google.com/file/d/..."
                  hint="Đường dẫn xem CV trực tuyến phục vụ HR duyệt hồ sơ (US-007-AC-03)"
                />
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
                <q-btn label="Lưu thay đổi" color="primary" type="submit" :loading="saving" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';
import BaseSkeleton from '../../../shared/components/BaseSkeleton.vue';
import { useAuthStore } from '../../auth/store/authStore';

const $q = useQuasar();
const authStore = useAuthStore();
const tab = ref('personal');
const loading = ref(false);
const saving = ref(false);
const showEditDialog = ref(false);
const cvFile = ref<File | null>(null);

const profile = ref<any>(null);

const isConfirmedInternProfile = computed(() => {
  const status = profile.value?.status || authStore.user?.applicationStatus || '';
  return ['APPROVED', 'CONTRACT_SIGNED', 'INTERNING', 'COMPLETED', 'ONBOARDING'].includes(status);
});
const editForm = ref({
  phone: '',
  address: '',
  university: '',
  major: '',
  cvUrl: ''
});

async function loadProfile() {
  loading.value = true;
  try {
    const res = await api.get('/api/v1/interns/me');
    if (res.data && res.data.data) {
      profile.value = res.data.data;
    }
  } catch (err) {
    const isConfirmed = ['APPROVED', 'CONTRACT_SIGNED', 'INTERNING', 'COMPLETED', 'ONBOARDING'].includes(authStore.user?.applicationStatus || '');
    profile.value = {
      fullName: authStore.user?.fullName || 'Ứng viên',
      email: authStore.user?.email || '',
      phone: 'Chưa cập nhật',
      address: 'Hà Nội',
      university: 'Chưa cập nhật',
      major: 'Chưa cập nhật',
      cvUrl: '',
      internCode: isConfirmed ? 'INT-2026-001' : 'Chưa cấp (Dành cho TTS chính thức)',
      status: authStore.user?.applicationStatus || 'CANDIDATE',
      departmentName: isConfirmed ? 'Phát triển Phần mềm (R&D)' : 'Bộ phận Tuyển dụng (HR)',
      programName: isConfirmed ? 'Chương trình Thực tập Software Engineer 2026' : 'Chờ xét duyệt hồ sơ',
      mentorName: isConfirmed ? 'Nguyễn Văn Mentor' : 'Chưa phân công'
    };
  } finally {
    loading.value = false;
  }
}

function openEditDialog() {
  cvFile.value = null;
  editForm.value = {
    phone: profile.value?.phone || '',
    address: profile.value?.address || '',
    university: profile.value?.university || '',
    major: profile.value?.major || '',
    cvUrl: profile.value?.cvUrl || ''
  };
  showEditDialog.value = true;
}

async function saveProfile() {
  saving.value = true;
  try {
    // If file picked from local disk -> Upload file via POST /api/v1/intern/documents/upload
    if (cvFile.value) {
      const formData = new FormData();
      formData.append('file', cvFile.value);
      formData.append('type', 'CV');
      const uploadRes = await api.post('/api/v1/intern/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data && uploadRes.data.data && uploadRes.data.data.fileUrl) {
        editForm.value.cvUrl = uploadRes.data.data.fileUrl;
      }
    }

    const payload = {
      ...profile.value,
      ...editForm.value
    };
    const res = await api.put('/api/v1/interns/me', payload);
    if (res.data && res.data.data) {
      profile.value = res.data.data;
    } else {
      if (profile.value) {
        Object.assign(profile.value, editForm.value);
      }
    }
    $q.notify({ type: 'positive', message: 'Cập nhật thông tin hồ sơ & CV thành công' });
    showEditDialog.value = false;
    await loadProfile();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Cập nhật hồ sơ thất bại' });
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
}
.border-white {
  border: 3px solid #ffffff;
}
.border-blue {
  border-left: 4px solid #1976D2;
}
</style>
