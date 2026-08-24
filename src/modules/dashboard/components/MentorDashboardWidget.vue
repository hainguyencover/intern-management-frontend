<template>
  <div class="q-col-gutter-md row">
    <!-- Row 1: Mentor Operational Stat Cards -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-teal-1 border-teal">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">TTS Đang Phân công (BR-01)</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-teal">{{ mentorStats.assignedCount }} <span class="text-caption text-grey-7">/ 5 TTS</span></div>
            <q-btn color="teal" label="Nhóm của tôi" size="sm" to="/interns" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Tiến độ Task Nhóm (US-016)</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-primary">{{ mentorStats.completionRate }}%</div>
            <q-btn color="primary" label="Giao Task" size="sm" to="/mentor/tasks" />

          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-orange-1 border-orange">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Báo cáo tuần chờ duyệt (US-018)</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-orange-10">{{ mentorStats.pendingReports }}</div>
            <q-btn color="orange-10" label="Duyệt báo cáo" size="sm" to="/tasks" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-purple-1 border-purple">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">TTS Đủ ĐK Đánh giá (BR-04)</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-purple">{{ mentorStats.eligibleForEval }}</div>
            <q-btn color="purple" label="Chấm điểm" size="sm" to="/evaluations" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 2: Pending Mentor Action Center -->
    <div class="col-12 col-md-7">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-teal flex items-center justify-between">
            <span>🎯 Action Center — Việc Mentor Cần Xử Lý Ngay</span>
            <q-badge color="teal" class="text-bold">{{ actionCenterItems.length }} Công việc</q-badge>
          </div>
          <q-separator class="q-my-sm" />

          <q-list separator v-if="actionCenterItems.length">
            <q-item v-for="item in actionCenterItems" :key="item.id" class="q-py-xs">
              <q-item-section avatar>
                <q-icon :name="item.icon" :color="item.color" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ item.title }}</q-item-label>
                <q-item-label caption>{{ item.subtitle }} • <span class="text-grey-6">{{ item.time }}</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense size="sm" :color="item.color" :label="item.btnLabel" :to="item.to" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-caption text-grey-7 text-center q-pa-md">Không có báo cáo hoặc đánh giá tồn đọng.</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 3: My Assigned Interns Quick Monitoring -->
    <div class="col-12 col-md-5">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-grey-9 flex items-center justify-between">
            <span>👥 Danh sách Thực tập sinh Phụ trách</span>
            <q-btn flat round dense icon="arrow_forward" color="primary" to="/interns" />
          </div>
          <q-separator class="q-my-sm" />

          <q-list separator class="text-caption" v-if="assignedInterns.length">
            <q-item v-for="intern in assignedInterns" :key="intern.id">
              <q-item-section avatar>
                <q-avatar size="32px" color="primary" text-color="white">{{ intern.fullName?.charAt(0) || 'I' }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ intern.fullName }}</q-item-label>
                <q-item-label caption>{{ intern.university }} — {{ intern.major }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="intern.progress >= 80 ? 'positive' : 'warning'" class="text-bold">
                  {{ intern.progress }}% Workload
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-caption text-grey-7 text-center q-pa-md">Đang tải danh sách TTS...</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient as api } from '../../../shared/api/client';

const mentorStats = ref({
  assignedCount: 4,
  completionRate: 82,
  pendingReports: 2,
  eligibleForEval: 3
});

const actionCenterItems = ref([
  { id: 1, title: 'Nguyễn Văn A — Nộp Báo cáo Tuần 4 (BR-10)', subtitle: 'Cần Mentor review & để lại feedback', time: 'Hôm nay', icon: 'rate_review', color: 'orange-10', btnLabel: 'Review Report', to: '/mentor/tasks' },
  { id: 2, title: 'Trần Thị B — Đạt 85% Workload (BR-04)', subtitle: 'Đủ điều kiện đánh giá kết quả thực tập', time: 'Mới đạt', icon: 'grade', color: 'purple', btnLabel: 'Đánh giá Ngay', to: '/evaluations' },
  { id: 3, title: 'Lê Văn C — Task "Tích hợp Spring Security" sắp trễ hạn', subtitle: 'Hạn chót: 17:30 Hôm nay', time: 'Gấp', icon: 'warning', color: 'negative', btnLabel: 'Xem Task', to: '/mentor/tasks' }
]);

const assignedInterns = ref([
  { id: 1, fullName: 'Nguyễn Văn A', university: 'ĐH Bách Khoa', major: 'CNTT', progress: 85 },
  { id: 2, fullName: 'Trần Thị B', university: 'ĐH Quốc Gia', major: 'Khoa học Máy tính', progress: 82 },
  { id: 3, fullName: 'Lê Văn C', university: 'ĐH Bưu Chính', major: 'An toàn Thông tin', progress: 78 },
  { id: 4, fullName: 'Phạm Thị D', university: 'ĐH Bách Khoa', major: 'Hệ thống Thông tin', progress: 65 }
]);

async function loadMentorData() {
  try {
    const res = await api.get('/api/v1/mentors/assigned-interns').catch(() => api.get('/api/v1/interns/assigned-to-me')).catch(() => null);

    if (res && res.data && res.data.data) {
      const list = res.data.data.content || res.data.data;
      if (Array.isArray(list)) {
        assignedInterns.value = list.map((item: any) => ({
          id: item.id,
          fullName: item.user?.fullName || item.fullName || 'TTS',
          university: item.university || 'Đại học',
          major: item.major || 'Chuyên ngành',
          progress: item.workloadProgress || 80
        }));
        mentorStats.value.assignedCount = list.length;
      }
    }
  } catch (err) {
  }
}

onMounted(() => {
  loadMentorData();
});
</script>

<style scoped>
.border-teal { border-left: 4px solid #009688; }
.border-blue { border-left: 4px solid #1976D2; }
.border-orange { border-left: 4px solid #F57C00; }
.border-purple { border-left: 4px solid #9C27B0; }
</style>
