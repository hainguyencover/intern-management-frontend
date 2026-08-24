<template>
  <q-page class="q-pa-md">
    <!-- Header & Search Filters -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h5 class="text-h5 text-weight-bold q-my-none">Danh sách Sinh viên Thực tập</h5>
        <div class="text-caption text-grey-7">Quản lý và giám sát tiến độ công việc, chuyên cần của sinh viên trường</div>
      </div>
      <div>
        <q-btn color="secondary" icon="refresh" label="Làm mới" @click="onRequest({ pagination })" />
      </div>
    </div>

    <!-- Filter Bar -->
    <q-card class="shadow-1 q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filters.keyword"
              dense
              outlined
              placeholder="Tìm theo tên hoặc MSSV..."
              debounce="400"
              @update:model-value="onFilterChange"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4">
            <q-select
              v-model="filters.status"
              dense
              outlined
              emit-value
              map-options
              clearable
              label="Trạng thái"
              :options="statusOptions"
              @update:model-value="onFilterChange"
            />
          </div>

          <div class="col-12 col-sm-4">
            <q-input
              v-model="filters.major"
              dense
              outlined
              placeholder="Lọc theo Chuyên ngành..."
              debounce="400"
              @update:model-value="onFilterChange"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Students Quasar Table -->
    <q-card class="shadow-1">
      <q-table
        flat
        v-model:pagination="pagination"
        :rows="students"
        :columns="columns"
        row-key="id"
        :loading="loading"
        binary-state-sort
        @request="onRequest"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-progress="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-linear-progress
                :value="props.row.progress?.completionRate / 100"
                color="primary"
                rounded
                class="col q-mr-sm"
              />
              <span class="text-weight-bold text-caption">{{ props.row.progress?.completionRate }}%</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-attendance="props">
          <q-td :props="props">
            <q-badge :color="props.row.attendance?.attendanceRate >= 80 ? 'teal' : 'negative'">
              {{ props.row.attendance?.attendanceRate }}%
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn flat size="sm" color="primary" icon="visibility" :to="`/university/students/${props.row.id}`">
              Chi tiết
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getUniversityStudents } from '@/services/universityService';
import type { UniversityStudent, UniversityStudentQuery } from '@/types/university';

const $q = useQuasar();
const loading = ref(false);
const students = ref<UniversityStudent[]>([]);

const filters = ref<UniversityStudentQuery>({
  keyword: '',
  status: undefined,
  major: ''
});

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
});

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đang thực tập (INTERNING)', value: 'INTERNING' },
  { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' },
  { label: 'Tạm dừng / Đình chỉ (SUSPENDED)', value: 'SUSPENDED' }
];

const columns = [
  { name: 'studentCode', label: 'MSSV', field: 'studentCode', align: 'left' as const },
  { name: 'fullName', label: 'Họ tên Sinh viên', field: 'fullName', align: 'left' as const },
  { name: 'major', label: 'Chuyên ngành', field: 'major', align: 'left' as const },
  { name: 'programName', label: 'Chương trình', field: 'programName', align: 'left' as const },
  { name: 'mentorName', label: 'Mentor', field: 'mentorName', align: 'left' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const },
  { name: 'progress', label: 'Tiến độ Công việc', field: 'progress', align: 'center' as const, style: 'width: 180px' },
  { name: 'attendance', label: 'Chuyên cần', field: 'attendance', align: 'center' as const },
  { name: 'action', label: 'Thao tác', field: 'id', align: 'center' as const }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'INTERNING': case 'ACTIVE': return 'teal';
    case 'COMPLETED': return 'positive';
    case 'SUSPENDED': case 'TERMINATED': return 'negative';
    default: return 'grey';
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  loading.value = true;
  try {
    const res = await getUniversityStudents({
      keyword: filters.value.keyword,
      status: filters.value.status,
      major: filters.value.major,
      page: page - 1,
      size: rowsPerPage
    });
    students.value = res.content || [];
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.rowsNumber = res.totalElements || 0;
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách sinh viên' });
  } finally {
    loading.value = false;
  }
}

function onFilterChange() {
  pagination.value.page = 1;
  onRequest({ pagination: pagination.value });
}

onMounted(() => {
  onRequest({ pagination: pagination.value });
});
</script>
