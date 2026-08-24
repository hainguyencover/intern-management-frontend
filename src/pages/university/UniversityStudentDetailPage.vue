<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-btn flat icon="arrow_back" label="Quay lại danh sách" color="primary" to="/university/students" />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="row justify-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <template v-else-if="student">
      <!-- Profile Summary Card -->
      <q-card class="shadow-1 q-mb-lg">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6 text-weight-bold">{{ student.fullName }}</div>
            <div class="text-subtitle2 text-grey-7">MSSV: {{ student.studentCode }} | Ngành: {{ student.major }}</div>
          </div>
          <div>
            <q-badge color="teal" class="text-subtitle2 q-pa-sm">
              {{ student.status }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>

      <!-- Grid Cards -->
      <div class="row q-col-gutter-md">
        <!-- Academic & Placement -->
        <div class="col-12 col-md-4">
          <q-card class="shadow-1 full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Thông tin Chương trình</div>
              <q-list separator dense>
                <q-item>
                  <q-item-section class="text-grey-7">Chương trình:</q-item-section>
                  <q-item-section class="text-weight-medium">{{ student.programName || 'N/A' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Mentor phụ trách:</q-item-section>
                  <q-item-section class="text-weight-medium">{{ student.mentorName || 'N/A' }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Task Completion -->
        <div class="col-12 col-md-4">
          <q-card class="shadow-1 full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Tiến độ Nhiệm vụ</div>
              <div class="text-h4 text-weight-bolder text-primary q-mb-sm">
                {{ student.progress?.completionRate }}%
              </div>
              <q-linear-progress
                :value="student.progress?.completionRate / 100"
                color="primary"
                size="15px"
                rounded
                class="q-mb-md"
              />
              <div class="text-caption">Đã hoàn thành: {{ student.progress?.completedTasks }} / {{ student.progress?.totalTasks }} tasks</div>
              <div v-if="student.progress?.overdueTasks > 0" class="text-caption text-negative text-weight-bold q-mt-xs">
                Quá hạn: {{ student.progress?.overdueTasks }} tasks
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Attendance Summary -->
        <div class="col-12 col-md-4">
          <q-card class="shadow-1 full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Tổng quan Chuyên cần</div>
              <div class="text-h4 text-weight-bolder text-teal q-mb-sm">
                {{ student.attendance?.attendanceRate }}%
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section class="text-grey-7">Số ngày làm việc:</q-item-section>
                  <q-item-section class="text-weight-bold">{{ student.attendance?.workingDays }} ngày</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Số ngày có mặt:</q-item-section>
                  <q-item-section class="text-weight-bold text-positive">{{ student.attendance?.presentDays }} ngày</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Số ngày nghỉ có phép:</q-item-section>
                  <q-item-section class="text-weight-bold text-warning">{{ student.attendance?.leaveDays }} ngày</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Evaluation Summary -->
      <q-card class="shadow-1 q-mt-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Đánh giá Thực tập Tổng quan</div>
          <div class="row items-center">
            <div class="text-h5 text-weight-bolder text-primary q-mr-lg">
              Điểm tổng kết: {{ student.evaluation?.overallScore != null ? student.evaluation.overallScore : 'Chưa có' }} / 10
            </div>
            <q-badge color="info" class="text-subtitle2">
              Trạng thái đánh giá: {{ student.evaluation?.status || 'PENDING' }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { getUniversityStudentDetail } from '@/services/universityService';
import type { UniversityStudent } from '@/types/university';

const route = useRoute();
const $q = useQuasar();
const loading = ref(true);
const student = ref<UniversityStudent | null>(null);

async function loadDetail() {
  const id = Number(route.params.studentId);
  if (!id) return;
  loading.value = true;
  try {
    student.value = await getUniversityStudentDetail(id);
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không tìm thấy thông tin sinh viên hoặc không có quyền truy cập' });
  } finally {
    loading.value = false;
  }
}

onMounted(loadDetail);
</script>
