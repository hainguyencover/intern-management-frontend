<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h5 class="text-h5 text-weight-bold q-my-none">Cổng thông tin Trường Đại học</h5>
        <div class="text-caption text-grey-7">Theo dõi tiến độ thực tập và chuyên cần của sinh viên theo thời gian thực</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="notifications"
          label="Thông báo Trường"
          to="/university/notifications"
        />
        <q-btn
          color="primary"
          icon="download"
          label="Xuất Báo cáo (Excel)"
          :loading="exporting"
          @click="onExport"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <template v-else-if="dashboard">
      <!-- KPI Cards Row -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-primary text-white shadow-2">
            <q-card-section>
              <div class="text-subtitle2">Tổng số sinh viên</div>
              <div class="text-h4 text-weight-bolder">{{ dashboard.totalStudents }}</div>
              <div class="text-caption text-white-8 q-mt-xs">Thuộc đơn vị nhà trường</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-teal text-white shadow-2">
            <q-card-section>
              <div class="text-subtitle2">Đang thực tập</div>
              <div class="text-h4 text-weight-bolder">{{ dashboard.interningStudents }}</div>
              <div class="text-caption text-white-8 q-mt-xs">Đang hoạt động tại doanh nghiệp</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-positive text-white shadow-2">
            <q-card-section>
              <div class="text-subtitle2">Hoàn thành</div>
              <div class="text-h4 text-weight-bolder">{{ dashboard.completedStudents }}</div>
              <div class="text-caption text-white-8 q-mt-xs">Tỷ lệ: {{ dashboard.completionRate }}%</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-negative text-white shadow-2">
            <q-card-section>
              <div class="text-subtitle2">Có nguy cơ chậm tiến độ</div>
              <div class="text-h4 text-weight-bolder">{{ dashboard.atRiskStudents }}</div>
              <div class="text-caption text-white-8 q-mt-xs">Cần nhà trường hỗ trợ</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Performance Progress & Attendance Summaries -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-card class="shadow-1">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold">Tỷ lệ hoàn thành công việc trung bình</div>
              <div class="row items-center q-mt-md">
                <q-linear-progress
                  :value="dashboard.completionRate / 100"
                  color="positive"
                  size="25px"
                  stripe
                  rounded
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="transparent" text-color="white" :label="`${dashboard.completionRate}%`" />
                  </div>
                </q-linear-progress>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="shadow-1">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold">Tỷ lệ chuyên cần toàn trường</div>
              <div class="row items-center q-mt-md">
                <q-linear-progress
                  :value="dashboard.attendanceRate / 100"
                  color="info"
                  size="25px"
                  stripe
                  rounded
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="transparent" text-color="white" :label="`${dashboard.attendanceRate}%`" />
                  </div>
                </q-linear-progress>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- At-Risk Students Warning Section -->
      <q-card class="shadow-1 q-mb-lg">
        <q-card-section class="row items-center justify-between">
          <div class="text-subtitle1 text-weight-bold text-negative flex items-center">
            <q-icon name="warning" color="negative" size="sm" class="q-mr-sm" />
            Sinh viên cần chú ý (At-Risk Students)
          </div>
          <q-btn flat color="primary" label="Xem tất cả" to="/university/students" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            flat
            dense
            :rows="dashboard.recentAtRiskStudents || []"
            :columns="atRiskColumns"
            row-key="id"
            hide-pagination
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-progress="props">
              <q-td :props="props">
                <q-linear-progress
                  :value="props.row.progress?.completionRate / 100"
                  :color="props.row.progress?.completionRate < 50 ? 'negative' : 'warning'"
                  rounded
                />
                <div class="text-caption text-weight-bold">{{ props.row.progress?.completionRate }}%</div>
              </q-td>
            </template>

            <template #body-cell-attendance="props">
              <q-td :props="props">
                <q-badge :color="props.row.attendance?.attendanceRate < 80 ? 'negative' : 'positive'">
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
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getUniversityDashboard, exportUniversityProgressReport } from '@/services/universityService';
import type { UniversityDashboardData } from '@/types/university';

const $q = useQuasar();
const loading = ref(true);
const exporting = ref(false);
const dashboard = ref<UniversityDashboardData | null>(null);

const atRiskColumns = [
  { name: 'studentCode', label: 'MSSV', field: 'studentCode', align: 'left' as const },
  { name: 'fullName', label: 'Họ và tên', field: 'fullName', align: 'left' as const },
  { name: 'major', label: 'Ngành học', field: 'major', align: 'left' as const },
  { name: 'mentorName', label: 'Mentor', field: 'mentorName', align: 'left' as const },
  { name: 'progress', label: 'Tiến độ Task', field: 'progress', align: 'center' as const },
  { name: 'attendance', label: 'Chuyên cần', field: 'attendance', align: 'center' as const },
  { name: 'action', label: 'Thao tác', field: 'id', align: 'center' as const }
];

async function loadDashboard() {
  loading.value = true;
  try {
    dashboard.value = await getUniversityDashboard();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể tải dữ liệu Dashboard trường đại học' });
  } finally {
    loading.value = false;
  }
}

async function onExport() {
  exporting.value = true;
  try {
    const blob = await exportUniversityProgressReport();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baocao_tiendo_thuctap.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    $q.notify({ type: 'positive', message: 'Xuất báo cáo thành công' });
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Xuất báo cáo thất bại' });
  } finally {
    exporting.value = false;
  }
}

onMounted(loadDashboard);
</script>
