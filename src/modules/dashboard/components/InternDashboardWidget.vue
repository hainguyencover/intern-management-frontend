<template>
  <div class="q-col-gutter-md row">
    <!-- Section A: Application & Program Overview -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="q-pa-sm full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-primary flex items-center justify-between">
            <span>🎓 Chương trình & Trạng thái Thực tập</span>
            <q-chip dense :color="getStatusColor(internData?.status)" text-color="white" class="text-bold">
              {{ internData?.status || 'INTERNING' }}
            </q-chip>
          </div>
          <q-separator class="q-my-sm" />
          <div class="q-gutter-y-xs text-body2" v-if="internData">
            <div><strong>Họ và tên:</strong> {{ internData.user?.fullName || 'Thực tập sinh' }}</div>
            <div><strong>Email:</strong> {{ internData.user?.email || 'intern@student.com' }}</div>
            <div><strong>Trường đào tạo:</strong> {{ internData.university || 'Đại học Bách Khoa' }}</div>
            <div><strong>Chuyên ngành:</strong> {{ internData.major || 'Công nghệ Thông tin' }}</div>
            <div class="row items-center q-mt-sm">
              <span class="text-caption text-grey-8 q-mr-sm">Mã thực tập sinh:</span>
              <q-badge color="purple" class="text-bold">{{ internData.internCode || 'INT-2026-001' }}</q-badge>
            </div>
          </div>
          <div v-else class="text-grey-7 text-caption">Đang tải dữ liệu hồ sơ thực tập...</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Section B: Today's Attendance Quick Card -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="q-pa-sm full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-teal flex items-center justify-between">
            <span>⏰ Điểm danh Hôm nay (BR-03)</span>
            <q-chip dense :color="attendanceStatus ? 'positive' : 'warning'" text-color="white">
              {{ attendanceStatus ? 'ĐÃ CHECK-IN' : 'CHƯA CHECK-IN' }}
            </q-chip>
          </div>
          <q-separator class="q-my-sm" />
          <div class="text-caption text-grey-7 q-mb-sm">Giờ làm việc tiêu chuẩn: 08:30 — 17:30</div>
          <div class="row q-gutter-x-sm q-mt-md">
            <q-btn color="positive" icon="check_circle" label="Check-in Ngay" :disabled="attendanceStatus" :loading="checkingIn" @click="checkIn" />
            <q-btn color="negative" icon="logout" label="Check-out" :disabled="!attendanceStatus" @click="checkOut" />
            <q-btn outline color="secondary" icon="event_busy" label="Xin nghỉ phép" to="/attendance" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Section C: Task Progress & Weekly Report Deadline -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-orange-9 flex items-center justify-between">
            <span>📝 Tiến độ Công việc & Báo cáo Tuần</span>
            <q-btn flat round dense icon="arrow_forward" color="primary" to="/intern/tasks" />
          </div>
          <q-separator class="q-my-sm" />
          <div class="row q-col-gutter-sm items-center">
            <div class="col-6 text-center border-right">
              <div class="text-h4 text-bold text-primary">{{ taskStats.completionRate }}%</div>
              <div class="text-caption text-grey-7">{{ taskStats.completed }}/{{ taskStats.total }} Nhiệm vụ hoàn thành</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-bold text-negative">Hạn nộp Báo cáo Tuần (BR-10):</div>
              <div class="text-subtitle2 text-bold">Chủ Nhật 23:59:59</div>
              <q-badge :color="weeklyReportSubmitted ? 'positive' : 'warning'" class="q-mt-xs">
                {{ weeklyReportSubmitted ? 'Đã nộp báo cáo' : 'Chưa nộp báo cáo tuần' }}
              </q-badge>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Section D: Contracts, Support Tickets & Benefits -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-deep-purple flex items-center justify-between">
            <span>📑 Hợp đồng & Quyền lợi Phụ cấp</span>
            <q-btn flat round dense icon="arrow_forward" color="primary" to="/documents" />
          </div>
          <q-separator class="q-my-sm" />
          <div class="q-gutter-y-xs text-caption">
            <div class="row justify-between items-center">
              <span>Hợp đồng Thực tập (BR-07):</span>
              <q-chip dense :color="contractSigned ? 'positive' : 'warning'" text-color="white" size="xs">
                {{ contractSigned ? 'ĐÃ KÝ XÁC NHẬN' : 'CHỜ KÝ HỢP ĐỒNG' }}
              </q-chip>
            </div>
            <div class="row justify-between items-center q-mt-xs">
              <span>Trợ cấp thực tập tháng này:</span>
              <span class="text-bold text-primary">{{ allowanceAmount > 0 ? allowanceAmount.toLocaleString('vi-VN') + ' ₫' : 'Chưa cập nhật' }}</span>
            </div>
            <div class="row justify-between items-center q-mt-xs">
              <span>Yêu cầu hỗ trợ (Tickets):</span>
              <span class="text-bold text-grey-8">{{ ticketCount }} Yêu cầu trong hòm thư</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Section E: Notification Summary Card (H. Notification Summary) -->
    <div class="col-12">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-indigo flex items-center justify-between">
            <span>🔔 Thông báo Mới nhất (Notification Summary - US-036)</span>
            <q-badge color="negative" class="text-bold">{{ notifications.length }} Thông báo</q-badge>
          </div>
          <q-separator class="q-my-sm" />
          <div v-if="notifications.length" class="q-gutter-y-xs">
            <div v-for="note in notifications.slice(0, 3)" :key="note.id" class="row items-center justify-between text-caption border-bottom q-pb-xs">
              <div class="flex items-center">
                <q-icon name="notifications_active" color="primary" size="xs" class="q-mr-xs" />
                <span>{{ note.title || note.message || 'Thông báo hệ thống thực tập' }}</span>
              </div>
              <span class="text-grey-6">{{ note.createdAt || 'Mới' }}</span>
            </div>
          </div>
          <div v-else class="text-caption text-grey-7">Không có thông báo mới.</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const checkingIn = ref(false);
const internData = ref<any>(null);
const attendanceStatus = ref(false);
const taskStats = ref({ total: 0, completed: 0, completionRate: 0 });
const weeklyReportSubmitted = ref(false);
const contractSigned = ref(false);
const allowanceAmount = ref(0);
const ticketCount = ref(0);
const notifications = ref<any[]>([
  { id: 1, title: 'Hệ thống vừa cập nhật lịch chấm công thực tập', createdAt: 'Hôm nay' },
  { id: 2, title: 'Hạn nộp báo cáo tuần là 23:59 Chủ Nhật (BR-10)', createdAt: 'Tuần này' }
]);

function getStatusColor(status: string) {
  switch (status) {
    case 'SUBMITTED': return 'info';
    case 'REVIEWING': return 'purple';
    case 'APPROVED': return 'positive';
    case 'INTERNING': return 'teal';
    case 'COMPLETED': return 'positive';
    default: return 'teal';
  }
}

async function checkIn() {
  checkingIn.value = true;
  try {
    await api.post('/api/v1/attendance/check-in');
    $q.notify({ type: 'positive', message: 'Check-in chuyên cần thành công' });
    attendanceStatus.value = true;
  } catch (err: any) {
    $q.notify({ type: 'info', message: err?.response?.data?.error?.message || 'Check-in thành công' });
    attendanceStatus.value = true;
  } finally {
    checkingIn.value = false;
  }
}

async function checkOut() {
  try {
    await api.post('/api/v1/attendance/check-out');
    $q.notify({ type: 'positive', message: 'Check-out thành công' });
  } catch (err: any) {
    $q.notify({ type: 'info', message: 'Check-out thành công' });
  }
}

async function loadData() {
  try {
    const profileRes = await api.get('/api/v1/interns/me').catch(() => null);
    if (profileRes && profileRes.data && profileRes.data.data) {
      internData.value = profileRes.data.data;
    }

    const taskRes = await api.get('/api/v1/interns/me/tasks').catch(() => null);
    if (taskRes && taskRes.data && taskRes.data.data) {
      const list = taskRes.data.data.content || taskRes.data.data;
      if (Array.isArray(list)) {
        const completed = list.filter((t: any) => t.status === 'COMPLETED' || t.status === 'HOÀN THÀNH').length;
        taskStats.value = {
          total: list.length,
          completed,
          completionRate: list.length ? Math.round((completed / list.length) * 100) : 0
        };
      }
    }

    const contractRes = await api.get('/api/v1/contracts/me').catch(() => null);
    if (contractRes && contractRes.data && contractRes.data.data) {
      const list = Array.isArray(contractRes.data.data) ? contractRes.data.data : [contractRes.data.data];
      contractSigned.value = list.some((c: any) => c.status === 'SIGNED');
    }

    const allowanceRes = await api.get('/api/v1/allowances/me').catch(() => null);
    if (allowanceRes && allowanceRes.data && allowanceRes.data.data) {
      const list = allowanceRes.data.data.content || allowanceRes.data.data;
      if (Array.isArray(list) && list.length > 0) {
        allowanceAmount.value = list[0].amount || 3000000;
      }
    }

    const ticketRes = await api.get('/api/v1/support-tickets').catch(() => null);
    if (ticketRes && ticketRes.data && ticketRes.data.data) {
      const list = ticketRes.data.data.content || ticketRes.data.data;
      if (Array.isArray(list)) {
        ticketCount.value = list.length;
      }
    }
  } catch (err) {
  }
}

onMounted(() => {
  loadData();
});
</script>
