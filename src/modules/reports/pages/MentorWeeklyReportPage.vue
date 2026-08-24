<template>
  <q-page class="q-pa-lg">
    <!-- Header Banner -->
    <div class="row items-center justify-between q-mb-lg bg-surface-dark q-pa-md border-radius-lg text-white">
      <div>
        <div class="text-h5 text-bold flex items-center gap-2">
          <q-icon name="rate_review" color="secondary" size="32px" />
          Đánh Giá Báo Cáo Tuần (Dành Cho Mentor)
        </div>
        <div class="text-subtitle2 text-grey-4">
          Xem và phản hồi báo cáo tuần của các Thực tập sinh thuộc danh sách quản lý của bạn.
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <q-card class="glass-card text-white q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-4">
            <q-select
              v-model="filter.status"
              :options="statusOptions"
              label="Lọc theo trạng thái"
              dark
              filled
              clearable
              emit-value
              map-options
              @update:model-value="fetchMentorReports"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filter.fromDate"
              type="date"
              label="Từ ngày"
              dark
              filled
              clearable
              @update:model-value="fetchMentorReports"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filter.toDate"
              type="date"
              label="Đến ngày"
              dark
              filled
              clearable
              @update:model-value="fetchMentorReports"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Reports Table -->
    <q-card class="glass-card text-white">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-sm">Danh sách báo cáo thực tập sinh</div>
        <q-table
          :rows="reports"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          dark
          class="bg-transparent"
        >
          <template v-slot:body-cell-internName="props">
            <q-td :props="props">
              <div class="text-bold text-primary">{{ props.row.internName || 'TTS' }}</div>
              <div class="text-caption text-grey-4">Mã: {{ props.row.internStudentCode || 'N/A' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status, props.row.late)"
                class="q-pa-xs text-bold"
              >
                {{ getStatusLabel(props.row.status, props.row.late) }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="rate_review"
                color="secondary"
                @click="openDetailDialog(props.row)"
              >
                <q-tooltip>Xem & Nhập phản hồi</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Detail & Feedback Dialog -->
    <q-dialog v-model="detailDialog.show">
      <q-card style="width: 800px; max-width: 90vw;" class="bg-grey-9 text-white" v-if="selectedReport">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6 text-bold">{{ selectedReport.title }}</div>
            <div class="text-subtitle2 text-primary">
              Thực tập sinh: {{ selectedReport.internName }} (Mã TTS: {{ selectedReport.internStudentCode || 'N/A' }})
            </div>
            <div class="text-caption text-grey-4">
              Tuần: {{ selectedReport.weekStartDate }} đến {{ selectedReport.weekEndDate }} | Nộp lúc: {{ formatDate(selectedReport.submittedAt) }}
            </div>
          </div>
          <div class="row items-center gap-2">
            <q-badge :color="getStatusColor(selectedReport.status, selectedReport.late)">
              {{ getStatusLabel(selectedReport.status, selectedReport.late) }}
            </q-badge>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-gutter-md">
          <div>
            <div class="text-subtitle2 text-primary text-bold">1. Công việc đã thực hiện</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line bg-grey-8 q-pa-sm border-radius-md">{{ selectedReport.workSummary }}</div>
          </div>

          <div v-if="selectedReport.achievements">
            <div class="text-subtitle2 text-positive text-bold">2. Kết quả đạt được</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line bg-grey-8 q-pa-sm border-radius-md">{{ selectedReport.achievements }}</div>
          </div>

          <div v-if="selectedReport.challenges">
            <div class="text-subtitle2 text-warning text-bold">3. Khó khăn / Vấn đề</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line bg-grey-8 q-pa-sm border-radius-md">{{ selectedReport.challenges }}</div>
          </div>

          <div v-if="selectedReport.nextWeekPlan">
            <div class="text-subtitle2 text-info text-bold">4. Kế hoạch tuần tới</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line bg-grey-8 q-pa-sm border-radius-md">{{ selectedReport.nextWeekPlan }}</div>
          </div>

          <!-- Existing Feedbacks -->
          <q-separator dark class="q-my-md" />
          <div class="text-subtitle1 text-bold flex items-center gap-2">
            <q-icon name="forum" color="secondary" />
            Lịch sử phản hồi của Mentor ({{ selectedReport.feedbacks?.length || 0 }})
          </div>

          <div v-if="selectedReport.feedbacks && selectedReport.feedbacks.length > 0" class="q-gutter-sm">
            <q-card v-for="fb in selectedReport.feedbacks" :key="fb.id" class="bg-grey-8 text-white q-pa-sm border-radius-md">
              <div class="row items-center justify-between">
                <div class="text-weight-bold text-secondary">{{ fb.mentorName || 'Mentor' }}</div>
                <div class="text-caption text-grey-4">{{ formatDate(fb.createdAt) }}</div>
              </div>
              <div class="text-body2 q-mt-xs text-grey-2">{{ fb.content }}</div>
            </q-card>
          </div>

          <!-- Send New Feedback Form -->
          <div class="q-mt-md">
            <div class="text-subtitle2 text-bold text-secondary q-mb-xs">Viết phản hồi cho thực tập sinh</div>
            <q-input
              v-model="feedbackContent"
              type="textarea"
              placeholder="Nhập nội dung phản hồi, nhận xét công việc, định hướng cho tuần tiếp theo..."
              rows="3"
              dark
              filled
            />
            <div class="row justify-end q-mt-sm">
              <q-btn
                color="secondary"
                icon="send"
                label="Gửi phản hồi"
                unelevated
                :loading="sendingFeedback"
                @click="submitFeedback"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator dark />
        <q-card-actions align="right">
          <q-btn label="Đóng" flat color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { weeklyReportApi } from '../api/weeklyReportApi';

const $q = useQuasar();

const reports = ref([]);
const loading = ref(false);
const sendingFeedback = ref(false);
const selectedReport = ref(null);
const feedbackContent = ref('');

const filter = ref({
  status: null,
  fromDate: null,
  toDate: null,
});

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đã nộp (Đúng hạn)', value: 'SUBMITTED' },
  { label: 'Trễ hạn', value: 'LATE' },
  { label: 'Bản nháp', value: 'DRAFT' },
];

const detailDialog = ref({
  show: false,
});

const columns = [
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left' },
  { name: 'week', label: 'Tuần thực hiện', field: row => `${row.weekStartDate} → ${row.weekEndDate}`, align: 'left' },
  { name: 'title', label: 'Tiêu đề', field: 'title', align: 'left' },
  { name: 'submittedAt', label: 'Thời gian nộp', field: row => row.submittedAt ? formatDate(row.submittedAt) : 'Chưa nộp', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'feedbacksCount', label: 'Phản hồi', field: row => row.feedbacks ? row.feedbacks.length : 0, align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' },
];

onMounted(() => {
  fetchMentorReports();
});

const fetchMentorReports = async () => {
  loading.value = true;
  try {
    const params = { page: 0, size: 50 };
    if (filter.value.status) params.status = filter.value.status;
    if (filter.value.fromDate) params.fromDate = filter.value.fromDate;
    if (filter.value.toDate) params.toDate = filter.value.toDate;

    const res = await weeklyReportApi.getMentorReports(params);
    reports.value = res.data?.data?.content || res.data?.data || [];
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách báo cáo tuần của thực tập sinh' });
  } finally {
    loading.value = false;
  }
};

const openDetailDialog = async (row) => {
  try {
    const res = await weeklyReportApi.getMentorReportDetail(row.id);
    selectedReport.value = res.data?.data || row;
  } catch (err) {
    selectedReport.value = row;
  }
  feedbackContent.value = '';
  detailDialog.value.show = true;
};

const submitFeedback = async () => {
  if (!feedbackContent.value.trim()) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập nội dung phản hồi' });
    return;
  }

  sendingFeedback.value = true;
  try {
    const res = await weeklyReportApi.addFeedback(selectedReport.value.id, {
      content: feedbackContent.value,
    });
    $q.notify({ type: 'positive', message: 'Gửi phản hồi thành công!' });
    feedbackContent.value = '';
    
    // Refresh detail
    const detailRes = await weeklyReportApi.getMentorReportDetail(selectedReport.value.id);
    selectedReport.value = detailRes.data?.data || selectedReport.value;
    
    fetchMentorReports();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gửi phản hồi thất bại' });
  } finally {
    sendingFeedback.value = false;
  }
};

const getStatusColor = (status, isLate) => {
  if (status === 'DRAFT') return 'amber-9';
  if (isLate || status === 'LATE') return 'negative';
  return 'positive';
};

const getStatusLabel = (status, isLate) => {
  if (status === 'DRAFT') return 'Bản Nháp';
  if (isLate || status === 'LATE') return 'Trễ Hạn';
  return 'Đã Nộp (Đúng Hạn)';
};

const formatDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleString('vi-VN');
};
</script>

<style scoped>
.glass-card {
  background: rgba(30, 34, 45, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
.bg-surface-dark {
  background: linear-gradient(135deg, #1e222d 0%, #2a3142 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.border-radius-lg {
  border-radius: 14px;
}
.border-radius-md {
  border-radius: 8px;
}
.whitespace-pre-line {
  white-space: pre-line;
}
</style>
