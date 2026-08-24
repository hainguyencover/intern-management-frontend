<template>
  <div class="intern-dashboard">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Xin chào, {{ authStore.user?.fullName || 'Thực tập sinh' }}!</div>
        <div class="text-caption text-grey-7">Chào mừng bạn quay trở lại hệ thống IMS.</div>
      </div>
      <q-chip color="blue-1" text-color="blue-10" icon="event">
        Kỳ thực tập 2026-Q3 (Tháng thứ 2)
      </q-chip>
    </div>

    <!-- Intern Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-blue-1 text-blue-10 fit">
          <q-card-section>
            <div class="text-caption text-uppercase text-weight-bold">Tiến độ Kỳ thực tập</div>
            <div class="text-h4 text-weight-bolder q-my-xs">72%</div>
            <q-linear-progress :value="0.72" color="blue-9" size="8px" class="rounded-borders q-mt-xs" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-green-1 text-green-10 fit">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Trạng thái Điểm danh</div>
              <div class="text-h5 text-weight-bolder q-mt-xs">Đã Check-in</div>
              <div class="text-caption text-grey-8">Hôm nay: 08:28 AM</div>
            </div>
            <q-icon name="check_circle" size="3em" color="positive" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-purple-1 text-purple-10 fit">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Nhiệm vụ Đã Hoàn thành</div>
              <div class="text-h4 text-weight-bolder q-my-xs">8 / 12</div>
              <div class="text-caption text-grey-8">4 nhiệm vụ đang tiến hành</div>
            </div>
            <q-icon name="task_alt" size="3em" color="purple" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Info Cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Báo cáo Tuần hiện tại</div>
            <q-chip color="orange-2" text-color="orange-10" icon="schedule">Hạn nộp: Thứ Sáu 17:00</q-chip>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-body2 text-grey-8">
              Bạn chưa nộp Báo cáo tuần cho tuần 34. Hãy tổng hợp các công việc đã hoàn thành và gửi cho Mentor review.
            </div>
            <q-btn color="primary" label="Viết Báo cáo ngay" icon="edit_note" class="q-mt-md" to="/intern/weekly-reports" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Thông tin Mentor Phụ trách</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center">
            <q-avatar size="56px" color="teal" text-color="white" class="q-mr-md">MB</q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold">Nguyễn Văn Mentor</div>
              <div class="text-caption text-grey-7">Senior Backend Developer - Tech Lead</div>
              <div class="text-caption text-blue-9">Email: mentor.nguyen@holaho.com</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
</script>
