<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Điểm danh & Xin nghỉ phép</h1>
        <p class="text-caption text-grey-7 q-mb-none">Theo dõi chuyên cần và phê duyệt đơn xin nghỉ phép theo quy định BR-07</p>
      </div>
      <div class="q-gutter-x-sm">
        <q-btn outline color="secondary" icon="qr_code_scanner" label="Tích hợp QR / Thẻ từ (US-038)" @click="openQrModal" />
        <q-btn color="warning" text-color="dark" icon="event_note" label="Gửi Đơn xin nghỉ" @click="openLeaveModal" />
        <q-btn color="positive" icon="check_circle" label="Check-in Đến" @click="checkIn" :loading="checkingIn" />
        <q-btn color="purple" icon="logout" label="Check-out Về" @click="checkOut" :loading="checkingOut" />
      </div>
    </div>

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
      <q-tab name="attendance" icon="today" label="Báo cáo Chuyên cần" />
      <q-tab name="leave" icon="event_busy" label="Duyệt Đơn nghỉ phép (BR-07)" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="q-mt-md">
      <!-- Attendance Tab -->
      <q-tab-panel name="attendance" class="q-pa-none">
        <q-card flat bordered>
          <q-table
            :rows="attendanceReports"
            :columns="attendanceCols"
            row-key="id"
            :loading="loadingAttendance"
            flat
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="props.value === 'PRESENT' ? 'positive' : 'warning'" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- Leave Requests Tab -->
      <q-tab-panel name="leave" class="q-pa-none">
        <q-card flat bordered>
          <q-table
            :rows="leaveRequests"
            :columns="leaveCols"
            row-key="id"
            :loading="loadingLeave"
            flat
          >
            <template #body-cell-durationDays="props">
              <q-td :props="props">
                <q-chip dense :color="props.value > 2 ? 'deep-orange' : 'info'" text-color="white" size="sm">
                  {{ props.value }} ngày {{ props.value > 2 ? '(Leo thang HR/Admin)' : '' }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense icon="check" color="positive" @click="approveLeave(props.row.id)" />
                <q-btn flat round dense icon="close" color="negative" @click="rejectLeave(props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- QR Code / Device Scanner Dialog (US-038) -->
    <q-dialog v-model="showQrDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Tích hợp Thiết bị QR / Thẻ từ (US-038)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-caption text-grey-8">Giả lập đồng bộ dữ liệu quẹt thẻ từ thiết bị phần cứng cửa ra vào:</p>
          <q-form @submit="submitQrSync" class="q-gutter-md">
            <q-input v-model="qrForm.employeeCode" label="Mã nhân viên / Email đăng ký *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="qrForm.deviceId" label="Mã thiết bị quét (Device ID) *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Đồng bộ ngay" color="secondary" type="submit" :loading="syncing" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Request Leave Dialog (US-024) -->
    <q-dialog v-model="showLeaveDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Gửi Đơn xin Nghỉ phép (US-024)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="submitLeave" class="q-gutter-md">
            <q-input v-model="leaveForm.startDate" label="Từ ngày *" type="date" outlined dense stack-label :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="leaveForm.endDate" label="Đến ngày *" type="date" outlined dense stack-label :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="leaveForm.reason" label="Lý do xin nghỉ *" type="textarea" outlined dense rows="3" :rules="[val => !!val || 'Bắt buộc']" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Gửi đơn" color="warning" text-color="dark" type="submit" :loading="savingLeave" />
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
const tab = ref('attendance');
const checkingIn = ref(false);
const syncing = ref(false);
const savingLeave = ref(false);
const loadingAttendance = ref(false);
const loadingLeave = ref(false);

const showQrDialog = ref(false);
const showLeaveDialog = ref(false);

const qrForm = ref({
  employeeCode: 'intern@student.com',
  deviceId: 'GATE-01'
});

const leaveForm = ref({
  startDate: new Date().toISOString().substring(0, 10),
  endDate: new Date().toISOString().substring(0, 10),
  reason: 'Nghỉ ốm / Việc gia đình'
});

const attendanceReports = ref([]);
const leaveRequests = ref([]);

function openQrModal() {
  qrForm.value = { employeeCode: 'intern@student.com', deviceId: 'GATE-01' };
  showQrDialog.value = true;
}

function openLeaveModal() {
  leaveForm.value = {
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    reason: 'Nghỉ ốm / Việc gia đình'
  };
  showLeaveDialog.value = true;
}

async function submitQrSync() {
  syncing.value = true;
  try {
    await api.post('/api/v1/attendances/sync-qr', [
      {
        employeeCode: qrForm.value.employeeCode,
        deviceId: qrForm.value.deviceId,
        timestamp: new Date().toISOString()
      }
    ]);
    $q.notify({ type: 'positive', message: 'Đã đồng bộ dữ liệu quẹt thẻ từ thiết bị thành công (US-038)' });
    showQrDialog.value = false;
    await loadAttendance();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Đồng bộ thiết bị thất bại' });
  } finally {
    syncing.value = false;
  }
}

async function submitLeave() {
  if (!leaveForm.value.startDate || !leaveForm.value.endDate) {
    $q.notify({ type: 'warning', message: 'Vui lòng chọn đầy đủ từ ngày và đến ngày nghỉ' });
    return;
  }

  const start = new Date(leaveForm.value.startDate);
  const end = new Date(leaveForm.value.endDate);
  if (end < start) {
    $q.notify({ type: 'negative', message: 'Ngày kết thúc nghỉ phép phải lớn hơn hoặc bằng ngày bắt đầu' });
    return;
  }

  savingLeave.value = true;
  try {
    await api.post('/api/v1/leave-requests', leaveForm.value);
    $q.notify({ type: 'positive', message: 'Tạo đơn xin nghỉ phép thành công (US-024 / BR-07)' });
    showLeaveDialog.value = false;
    await loadLeaveRequests();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Tạo đơn nghỉ thất bại' });
  } finally {
    savingLeave.value = false;
  }
}

const attendanceCols = [
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left' },
  { name: 'date', label: 'Ngày', field: 'date', align: 'center' },
  { name: 'checkIn', label: 'Giờ Check-in', field: (row: any) => row.checkIn ? new Date(row.checkIn).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : (row.checkInTime || '-'), align: 'center' },
  { name: 'checkOut', label: 'Giờ Check-out', field: (row: any) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '-', align: 'center' },
  { name: 'totalMinutes', label: 'Thời gian làm việc', field: (row: any) => row.totalMinutes ? `${Math.floor(row.totalMinutes / 60)}g ${row.totalMinutes % 60}p` : '-', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' }
];

const leaveCols = [
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left' },
  { name: 'startDate', label: 'Từ ngày', field: 'startDate', align: 'center' },
  { name: 'endDate', label: 'Đến ngày', field: 'endDate', align: 'center' },
  { name: 'durationDays', label: 'Số ngày nghỉ', field: 'durationDays', align: 'center' },
  { name: 'reason', label: 'Lý do', field: 'reason', align: 'left' },
  { name: 'actions', label: 'Phê duyệt', field: 'actions', align: 'right' }
];

async function checkIn() {
  checkingIn.value = true;
  try {
    await api.post('/api/v1/attendance/check-in');
    $q.notify({ type: 'positive', message: 'Check-in chuyên cần thành công!' });
    await loadAttendance();
  } catch (err: any) {
    $q.notify({ type: 'info', message: err?.response?.data?.error?.message || 'Check-in thành công' });
  } finally {
    checkingIn.value = false;
  }
}

async function loadAttendance() {
  loadingAttendance.value = true;
  try {
    const res = await api.get('/api/v1/attendance/report');
    if (res.data && res.data.data) {
      attendanceReports.value = res.data.data.content || res.data.data;
    }
  } catch (err) {
  } finally {
    loadingAttendance.value = false;
  }
}

async function loadLeaveRequests() {
  loadingLeave.value = true;
  try {
    const res = await api.get('/api/v1/leave-requests/pending');
    if (res.data && res.data.data) {
      leaveRequests.value = res.data.data.content || res.data.data;
    }
  } catch (err) {
  } finally {
    loadingLeave.value = false;
  }
}

async function approveLeave(id: number) {
  try {
    await api.post(`/api/v1/leave-requests/${id}/approve`);
    $q.notify({ type: 'positive', message: 'Đã duyệt đơn nghỉ phép' });
    await loadLeaveRequests();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Thao tác thất bại' });
  }
}

async function rejectLeave(id: number) {
  try {
    await api.post(`/api/v1/leave-requests/${id}/reject`);
    $q.notify({ type: 'warning', message: 'Đã từ chối đơn' });
    await loadLeaveRequests();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Thao tác thất bại' });
  }
}

onMounted(() => {
  loadAttendance();
  loadLeaveRequests();
});
</script>
