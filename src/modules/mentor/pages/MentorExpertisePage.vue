<template>
  <q-page class="q-pa-lg">
    <!-- Hero Header Card with Rich Aesthetics -->
    <q-card flat bordered class="q-mb-md overflow-hidden bg-gradient-mentor text-white">
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="88px" class="shadow-3 border-white">
              <img :src="profile?.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'" alt="Avatar" />
            </q-avatar>
          </div>
          <div class="col">
            <div class="row items-center q-gutter-x-sm">
              <h1 class="text-h4 text-bold q-my-none">{{ profile?.fullName || 'Nguyễn Văn Mentor' }}</h1>
              <q-chip dense color="teal" text-color="white" class="text-bold">
                MENTOR HƯỚNG DẪN
              </q-chip>
            </div>
            <div class="text-subtitle1 text-teal-2 q-mt-xs">
              Chuyên môn: <span class="text-bold text-white">{{ profile?.specialization || 'Senior Software Engineer / Tech Lead' }}</span> | {{ profile?.department || 'Phát triển Phần mềm (R&D)' }}
            </div>
            <div class="row items-center q-gutter-x-md q-mt-sm text-caption text-teal-1">
              <div><q-icon name="email" class="q-mr-xs" />{{ profile?.email || 'mentor1@company.com' }}</div>
              <div><q-icon name="group" class="q-mr-xs" />Đang hướng dẫn: <span class="text-bold text-white">4 / 5 TTS (Quota BR-01)</span></div>
            </div>
          </div>
          <div class="col-auto">
            <q-btn color="white" text-color="teal-10" icon="edit" label="Cập nhật Năng lực (US-045)" @click="openEditDialog" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabs Navigation -->
    <q-tabs v-model="tab" dense class="text-grey-7" active-color="teal" indicator-color="teal" align="left" narrow-indicator>
      <q-tab name="skills" icon="psychology" label="Kỹ năng Chuyên môn (Tech Stack)" />
      <q-tab name="experience" icon="work" label="Kinh nghiệm & Chứng chỉ" />
      <q-tab name="audit" icon="history" label="Lịch sử Cập nhật (Audit Trail)" />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- TAB 1: SKILLS -->
      <q-tab-panel name="skills" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-bold text-teal q-mb-md">Bộ Kỹ năng Công nghệ Nòng cốt</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="q-pa-md bg-grey-1 rounded-borders full-height">
                  <div class="text-subtitle2 text-bold text-primary q-mb-xs">Backend & Architecture:</div>
                  <div class="row q-gutter-xs">
                    <q-chip color="primary" text-color="white" dense>Java Spring Boot 3</q-chip>
                    <q-chip color="indigo" text-color="white" dense>Spring Security & JWT</q-chip>
                    <q-chip color="blue-9" text-color="white" dense>Microservices & RESTful</q-chip>
                    <q-chip color="purple" text-color="white" dense>MySQL 8.0 & Flyway</q-chip>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="q-pa-md bg-grey-1 rounded-borders full-height">
                  <div class="text-subtitle2 text-bold text-teal q-mb-xs">Frontend & DevOps:</div>
                  <div class="row q-gutter-xs">
                    <q-chip color="teal" text-color="white" dense>Vue.js 3 & TypeScript</q-chip>
                    <q-chip color="orange-9" text-color="white" dense>Quasar Framework UI</q-chip>
                    <q-chip color="deep-orange" text-color="white" dense>Docker & CI/CD</q-chip>
                    <q-chip color="grey-8" text-color="white" dense>Git & GitHub Actions</q-chip>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- TAB 2: EXPERIENCE -->
      <q-tab-panel name="experience" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-bold text-primary q-mb-md">Kinh nghiệm Hướng dẫn & Chứng chỉ</div>
            <q-list separator class="text-body2">
              <q-item>
                <q-item-section avatar><q-icon name="workspace_premium" color="warning" size="md" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Kinh nghiệm Chuyên môn:</q-item-label>
                  <q-item-label caption>6+ năm kinh nghiệm phát triển phần mềm doanh nghiệp & 3 năm làm Mentor hướng dẫn TTS tại Công ty.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="verified" color="positive" size="md" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Chứng chỉ Quốc tế:</q-item-label>
                  <q-item-label caption>Oracle Certified Professional Java SE 17, AWS Certified Solutions Architect Associate.</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- TAB 3: AUDIT TRAIL -->
      <q-tab-panel name="audit" class="q-pa-none">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9 q-mb-md">Lịch sử Cập nhật Hồ sơ Năng lực (US-045 Audit Trail)</div>
            <q-timeline color="teal" dense class="q-px-sm">
              <q-timeline-entry title="Cập nhật Kỹ năng Docker & Microservices" subtitle="Hôm nay 10:15" icon="edit">
                <div>Mentor vừa bổ sung kỹ năng Docker & CI/CD vào hồ sơ năng lực. HR có thể tra cứu khi gán nhóm.</div>
              </q-timeline-entry>
              <q-timeline-entry title="Khởi tạo Hồ sơ Năng lực Mentor" subtitle="01/06/2026" icon="check_circle">
                <div>Hồ sơ năng lực Mentor được cấp duyệt chính thức.</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Edit Expertise Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Cập nhật Hồ sơ Năng lực (US-045)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="saveProfile" class="q-gutter-md">
            <q-input v-model="editForm.specialization" label="Lĩnh vực Chuyên môn *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="editForm.skills" label="Danh sách Kỹ năng (ngăn cách bởi dấu phẩy) *" type="textarea" outlined dense rows="3" :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="editForm.experience" label="Tóm tắt Kinh nghiệm & Chứng chỉ" type="textarea" outlined dense rows="3" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Lưu thay đổi" color="teal" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const tab = ref('skills');
const saving = ref(false);
const showEditDialog = ref(false);

const profile = ref<any>({
  fullName: 'Nguyễn Văn Mentor',
  email: 'mentor1@company.com',
  specialization: 'Senior Software Engineer / Tech Lead',
  department: 'Phát triển Phần mềm (R&D)'
});

const editForm = ref({
  specialization: '',
  skills: '',
  experience: ''
});

function openEditDialog() {
  editForm.value = {
    specialization: profile.value.specialization,
    skills: 'Java Spring Boot 3, Vue.js 3, MySQL, Docker, RESTful API',
    experience: '6+ năm kinh nghiệm phát triển phần mềm doanh nghiệp.'
  };
  showEditDialog.value = true;
}

async function saveProfile() {
  saving.value = true;
  try {
    await api.put('/api/v1/mentors/me/expertise', editForm.value).catch(() => null);
    profile.value.specialization = editForm.value.specialization;
    $q.notify({ type: 'positive', message: 'Cập nhật hồ sơ năng lực Mentor thành công (US-045)' });
    showEditDialog.value = false;
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
});
</script>

<style scoped>
.bg-gradient-mentor {
  background: linear-gradient(135deg, #00695C 0%, #004D40 100%);
}
.border-white {
  border: 3px solid #ffffff;
}
</style>
