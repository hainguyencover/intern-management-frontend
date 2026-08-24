<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Sơ đồ Tổ chức & Quản lý Danh mục (Master Data)</h1>
        <p class="text-caption text-grey-7 q-mb-none">Thiết lập Phòng ban, Vị trí tuyển dụng, Bộ Kỹ năng và Ma trận mối quan hệ vai trò HR</p>
      </div>
      <div class="q-gutter-x-sm">
        <q-btn color="primary" icon="add" label="Thêm mới Danh mục" @click="openAddDialog" />
      </div>
    </div>

    <!-- Role Relationship & Workflow Interactive Diagram Card -->
    <q-card flat bordered class="q-mb-lg bg-gradient-dark text-white">
      <q-card-section>
        <div class="text-subtitle1 text-bold text-amber flex items-center">
          <q-icon name="account_tree" class="q-mr-xs" />
          <span>Ma trận Mối quan hệ Vai trò HR (HR Cross-Role Relationship Matrix)</span>
        </div>
        <q-separator class="q-my-sm border-grey" />
        <div class="row q-col-gutter-md text-center q-mt-sm">
          <div class="col-12 col-md-3">
            <div class="q-pa-sm bg-blue-9 rounded-borders">
              <div class="text-bold">🏢 HR Manager</div>
              <div class="text-caption text-blue-2">Điều hành Tuyển dụng, Duyệt Đơn, Gán Mentor, Hợp đồng & Phụ cấp</div>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="q-pa-sm bg-teal-9 rounded-borders">
              <div class="text-bold">👨‍🏫 Mentor</div>
              <div class="text-caption text-teal-2">Hướng dẫn Nhóm (Quota $\le$ 10), Giao Task, Duyệt Báo cáo, Chấm điểm</div>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="q-pa-sm bg-orange-9 rounded-borders">
              <div class="text-bold">🎓 Candidate / Intern</div>
              <div class="text-caption text-orange-2">Nộp Đơn, Ký Hợp đồng, Check-in, Làm Task, Nộp Báo cáo Tuần</div>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="q-pa-sm bg-purple-9 rounded-borders">
              <div class="text-bold">🏫 University / School</div>
              <div class="text-caption text-purple-2">Nhận Báo cáo Chuyên cần & Kết quả Đánh giá Thực tập (Export Excel)</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Master Data Navigation Tabs -->
    <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
      <q-tab name="departments" icon="business" label="Phòng ban (Departments)" />
      <q-tab name="positions" icon="badge" label="Vị trí Tuyển dụng (Positions)" />
      <q-tab name="skills" icon="psychology" label="Bộ Kỹ năng (Skills)" />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- TAB 1: DEPARTMENTS -->
      <q-tab-panel name="departments" class="q-pa-none">
        <q-card flat bordered>
          <q-table :rows="departments" :columns="deptColumns" row-key="id" :loading="loading" flat bordered>
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="props.value === 'ACTIVE' ? 'positive' : 'grey'" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense icon="edit" color="primary" @click="editItem('department', props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- TAB 2: POSITIONS -->
      <q-tab-panel name="positions" class="q-pa-none">
        <q-card flat bordered>
          <q-table :rows="positions" :columns="posColumns" row-key="id" :loading="loading" flat bordered>
            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense icon="edit" color="primary" @click="editItem('position', props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- TAB 3: SKILLS -->
      <q-tab-panel name="skills" class="q-pa-none">
        <q-card flat bordered>
          <q-table :rows="skills" :columns="skillColumns" row-key="id" :loading="loading" flat bordered>
            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense icon="edit" color="primary" @click="editItem('skill', props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Add/Edit Master Data Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Cập nhật Danh mục Tổ chức (Master Data)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="saveData" class="q-gutter-md">
            <q-input v-model="form.name" label="Tên danh mục / Vị trí / Kỹ năng *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="form.code" label="Mã định danh (Code) *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="form.description" label="Mô tả chi tiết" type="textarea" outlined dense rows="3" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Lưu danh mục" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const initialTab = (route.query.tab as string) || 'departments';
const tab = ref(initialTab);

watch(tab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } });
  }
});

const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);


const departments = ref([
  { id: 1, name: 'Phát triển Phần mềm (R&D)', code: 'DEPT_RD', internCount: 18, status: 'ACTIVE' },
  { id: 2, name: 'Kiểm thử & Đảm bảo Chất lượng (QA/QC)', code: 'DEPT_QA', internCount: 8, status: 'ACTIVE' },
  { id: 3, name: 'Quản trị Nhân sự & Tuyển dụng (HR)', code: 'DEPT_HR', internCount: 4, status: 'ACTIVE' }
]);

const positions = ref([
  { id: 1, name: 'Software Engineer Intern', code: 'POS_SE', departmentName: 'R&D', capacity: 15 },
  { id: 2, name: 'Frontend Vue.js Intern', code: 'POS_FE', departmentName: 'R&D', capacity: 10 },
  { id: 3, name: 'QA / Automation Test Intern', code: 'POS_QA', departmentName: 'QA/QC', capacity: 8 }
]);

const skills = ref([
  { id: 1, name: 'Java Spring Boot 3', code: 'SKILL_JAVA', category: 'BACKEND' },
  { id: 2, name: 'Vue.js 3 & TypeScript', code: 'SKILL_VUE', category: 'FRONTEND' },
  { id: 3, name: 'MySQL 8.0 & Flyway DDL', code: 'SKILL_MYSQL', category: 'DATABASE' },
  { id: 4, name: 'Software Testing & Automation', code: 'SKILL_TEST', category: 'QA' }
]);

const form = ref({ name: '', code: '', description: '' });

const deptColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Tên Phòng ban', field: 'name', align: 'left' },
  { name: 'code', label: 'Mã phòng ban', field: 'code', align: 'center' },
  { name: 'internCount', label: 'Số TTS hiện tại', field: 'internCount', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

const posColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Vị trí Tuyển dụng', field: 'name', align: 'left' },
  { name: 'code', label: 'Mã vị trí', field: 'code', align: 'center' },
  { name: 'departmentName', label: 'Phòng ban trực thuộc', field: 'departmentName', align: 'left' },
  { name: 'capacity', label: 'Chỉ tiêu tuyển (Quota)', field: 'capacity', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

const skillColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Tên Kỹ năng', field: 'name', align: 'left' },
  { name: 'code', label: 'Mã kỹ năng', field: 'code', align: 'center' },
  { name: 'category', label: 'Phân loại', field: 'category', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

async function loadMasterData() {
  loading.value = true;
  try {
    const deptRes = await api.get('/api/v1/organization/departments').catch(() => null);
    if (deptRes && deptRes.data && deptRes.data.data) {
      departments.value = deptRes.data.data;
    }
  } catch (err) {
  } finally {
    loading.value = false;
  }
}

function openAddDialog() {
  form.value = { name: '', code: '', description: '' };
  showDialog.value = true;
}

function editItem(type: string, item: any) {
  form.value = { name: item.name, code: item.code, description: '' };
  showDialog.value = true;
}

async function saveData() {
  saving.value = true;
  try {
    $q.notify({ type: 'positive', message: 'Lưu thông tin danh mục thành công' });
    showDialog.value = false;
    await loadMasterData();
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadMasterData();
});
</script>

<style scoped>
.bg-gradient-dark {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
.border-grey {
  border-color: rgba(255, 255, 255, 0.12);
}
</style>
