<template>
  <q-page class="q-pa-lg">
    <!-- Header Banner -->
    <div class="row items-center justify-between q-mb-lg bg-surface-dark q-pa-md border-radius-lg text-white">
      <div>
        <div class="text-h5 text-bold flex items-center gap-2">
          <q-icon name="assignment" color="primary" size="32px" />
          Báo Cáo Tuần Của Tôi
        </div>
        <div class="text-subtitle2 text-grey-4">
          Hạn nộp báo cáo: <strong>23:59 Chủ Nhật hàng tuần</strong>. Báo cáo nộp sau thời gian này sẽ được đánh dấu <strong>Trễ hạn</strong>.
        </div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Tạo báo cáo tuần"
        unelevated
        class="border-radius-md"
        @click="openCreateDialog"
      />
    </div>

    <!-- Stats summary cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card class="glass-card text-white">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-4">Tổng số báo cáo</div>
              <div class="text-h4 text-bold">{{ reports.length }}</div>
            </div>
            <q-icon name="folder" size="36px" color="blue-4" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="glass-card text-white">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-4">Đúng hạn</div>
              <div class="text-h4 text-bold text-positive">{{ onTimeCount }}</div>
            </div>
            <q-icon name="check_circle" size="36px" color="positive" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="glass-card text-white">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-4">Trễ hạn / Nháp</div>
              <div class="text-h4 text-bold text-warning">{{ lateOrDraftCount }}</div>
            </div>
            <q-icon name="warning" size="36px" color="warning" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Reports Table -->
    <q-card class="glass-card text-white">
      <q-card-section>
        <div class="text-h6 text-bold q-mb-sm">Lịch sử báo cáo</div>
        <q-table
          :rows="reports"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          dark
          class="bg-transparent"
        >
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
                icon="visibility"
                color="info"
                @click="openDetailDialog(props.row)"
              >
                <q-tooltip>Xem chi tiết & Phản hồi</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.status === 'DRAFT'"
                flat
                round
                dense
                icon="edit"
                color="warning"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip>Chỉnh sửa bản nháp</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.status === 'DRAFT'"
                flat
                round
                dense
                icon="send"
                color="positive"
                @click="confirmSubmit(props.row)"
              >
                <q-tooltip>Nộp báo cáo</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Form Modal (Create / Edit) -->
    <q-dialog v-model="formDialog.show" persistent max-width="700px">
      <q-card style="width: 700px; max-width: 90vw;" class="bg-grey-9 text-white">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-bold">
            {{ formDialog.isEdit ? 'Chỉnh sửa dự thảo báo cáo' : 'Tạo dự thảo báo cáo tuần' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-sm" v-if="!formDialog.isEdit">
            <div class="col-6">
              <q-input
                v-model="form.weekStartDate"
                type="date"
                label="Ngày bắt đầu tuần *"
                dark
                filled
                :rules="[val => !!val || 'Vui lòng chọn ngày']"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.weekEndDate"
                type="date"
                label="Ngày kết thúc tuần *"
                dark
                filled
                :rules="[val => !!val || 'Vui lòng chọn ngày']"
              />
            </div>
          </div>

          <q-input
            v-model="form.title"
            label="Tiêu đề báo cáo *"
            placeholder="Ví dụ: Báo cáo kết quả công việc tuần 32"
            dark
            filled
            :rules="[val => !!val || 'Tiêu đề không được trống']"
          />

          <q-input
            v-model="form.workSummary"
            type="textarea"
            label="Công việc đã thực hiện *"
            placeholder="Mô tả công việc đã làm trong tuần..."
            rows="3"
            dark
            filled
            :rules="[val => !!val || 'Nội dung công việc không được trống']"
          />

          <q-input
            v-model="form.achievements"
            type="textarea"
            label="Kết quả đạt được"
            placeholder="Các kết quả nổi bật, tính năng đã hoàn thành..."
            rows="2"
            dark
            filled
          />

          <q-input
            v-model="form.challenges"
            type="textarea"
            label="Khó khăn / Vấn đề gặp phải"
            placeholder="Khó khăn về kỹ thuật, tiến độ, tài liệu..."
            rows="2"
            dark
            filled
          />

          <q-input
            v-model="form.nextWeekPlan"
            type="textarea"
            label="Kế hoạch tuần tiếp theo"
            placeholder="Nhiệm vụ dự kiến thực hiện tuần sau..."
            rows="2"
            dark
            filled
          />
        </q-card-section>

        <q-separator dark />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Hủy" flat color="grey" v-close-popup />
          <q-btn
            :label="formDialog.isEdit ? 'Lưu thay đổi' : 'Lưu nháp'"
            color="primary"
            unelevated
            :loading="saving"
            @click="saveReport"
          />
        </q-card-actions>
      </q-card>
    </dialog>

    <!-- Detail Dialog -->
    <q-dialog v-model="detailDialog.show">
      <q-card style="width: 750px; max-width: 90vw;" class="bg-grey-9 text-white" v-if="selectedReport">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6 text-bold">{{ selectedReport.title }}</div>
            <div class="text-caption text-grey-4">
              Tuần: {{ selectedReport.weekStartDate }} đến {{ selectedReport.weekEndDate }}
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
            <div class="text-subtitle2 text-primary text-bold">Công việc đã thực hiện</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line">{{ selectedReport.workSummary }}</div>
          </div>

          <div v-if="selectedReport.achievements">
            <div class="text-subtitle2 text-positive text-bold">Kết quả đạt được</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line">{{ selectedReport.achievements }}</div>
          </div>

          <div v-if="selectedReport.challenges">
            <div class="text-subtitle2 text-warning text-bold">Khó khăn / Vấn đề</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line">{{ selectedReport.challenges }}</div>
          </div>

          <div v-if="selectedReport.nextWeekPlan">
            <div class="text-subtitle2 text-info text-bold">Kế hoạch tuần tới</div>
            <div class="text-body2 text-grey-3 whitespace-pre-line">{{ selectedReport.nextWeekPlan }}</div>
          </div>

          <!-- Feedbacks Section -->
          <q-separator dark class="q-my-md" />
          <div class="text-subtitle1 text-bold flex items-center gap-2">
            <q-icon name="comment" color="primary" />
            Phản hồi từ Mentor ({{ selectedReport.feedbacks?.length || 0 }})
          </div>

          <div v-if="!selectedReport.feedbacks || selectedReport.feedbacks.length === 0" class="text-grey-5 italic">
            Chưa có phản hồi nào từ Mentor.
          </div>

          <div v-else class="q-gutter-sm">
            <q-card v-for="fb in selectedReport.feedbacks" :key="fb.id" class="bg-grey-8 text-white q-pa-sm border-radius-md">
              <div class="row items-center justify-between">
                <div class="text-weight-bold text-primary">{{ fb.mentorName || 'Mentor' }}</div>
                <div class="text-caption text-grey-4">{{ formatDate(fb.createdAt) }}</div>
              </div>
              <div class="text-body2 q-mt-xs text-grey-2">{{ fb.content }}</div>
            </q-card>
          </div>
        </q-card-section>

        <q-separator dark />
        <q-card-actions align="right">
          <q-btn label="Đóng" flat color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </dialog>

    <!-- Confirm Submit Dialog -->
    <q-dialog v-model="confirmDialog.show">
      <q-card class="bg-grey-9 text-white">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" class="q-mr-md" />
          <div>
            <div class="text-h6">Xác nhận nộp báo cáo</div>
            <div class="text-caption text-grey-4">
              Sau khi nộp, bạn sẽ không thể chỉnh sửa báo cáo tuần này. Bạn có chắc chắn muốn nộp?
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Hủy" flat color="grey" v-close-popup />
          <q-btn label="Xác nhận Nộp" color="positive" unelevated :loading="submitting" @click="executeSubmit" />
        </q-card-actions>
      </q-card>
    </dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { weeklyReportApi } from '../api/weeklyReportApi';

const $q = useQuasar();

const reports = ref([]);
const loading = ref(false);
const saving = ref(false);
const submitting = ref(false);

const selectedReport = ref(null);

const formDialog = ref({
  show: false,
  isEdit: false,
  reportId: null,
});

const detailDialog = ref({
  show: false,
});

const confirmDialog = ref({
  show: false,
  report: null,
});

const form = ref({
  weekStartDate: '',
  weekEndDate: '',
  title: '',
  workSummary: '',
  achievements: '',
  challenges: '',
  nextWeekPlan: '',
});

const columns = [
  { name: 'week', label: 'Tuần thực hiện', field: row => `${row.weekStartDate} → ${row.weekEndDate}`, align: 'left' },
  { name: 'title', label: 'Tiêu đề', field: 'title', align: 'left' },
  { name: 'submittedAt', label: 'Ngày nộp', field: row => row.submittedAt ? formatDate(row.submittedAt) : 'Chưa nộp', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'feedbacksCount', label: 'Phản hồi', field: row => row.feedbacks ? row.feedbacks.length : 0, align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' },
];

const onTimeCount = computed(() => reports.value.filter(r => r.status === 'SUBMITTED' && !r.late).length);
const lateOrDraftCount = computed(() => reports.value.filter(r => r.status === 'DRAFT' || r.late).length);

onMounted(() => {
  fetchMyReports();
});

const fetchMyReports = async () => {
  loading.value = true;
  try {
    const res = await weeklyReportApi.getMyReports({ page: 0, size: 50 });
    reports.value = res.data?.data?.content || res.data?.data || [];
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách báo cáo tuần' });
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  formDialog.value = { show: true, isEdit: false, reportId: null };
  // Default to current week Monday -> Sunday
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diffToMonday));
  const sunday = new Date(today.setDate(monday.getDate() + 6));

  form.value = {
    weekStartDate: monday.toISOString().split('T')[0],
    weekEndDate: sunday.toISOString().split('T')[0],
    title: `Báo cáo tuần (${monday.toLocaleDateString('vi-VN')} - ${sunday.toLocaleDateString('vi-VN')})`,
    workSummary: '',
    achievements: '',
    challenges: '',
    nextWeekPlan: '',
  };
};

const openEditDialog = (row) => {
  formDialog.value = { show: true, isEdit: true, reportId: row.id };
  form.value = {
    weekStartDate: row.weekStartDate,
    weekEndDate: row.weekEndDate,
    title: row.title,
    workSummary: row.workSummary,
    achievements: row.achievements,
    challenges: row.challenges,
    nextWeekPlan: row.nextWeekPlan,
  };
};

const saveReport = async () => {
  if (!form.value.title || !form.value.workSummary) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung công việc' });
    return;
  }

  saving.value = true;
  try {
    if (formDialog.value.isEdit) {
      await weeklyReportApi.updateDraft(formDialog.value.reportId, form.value);
      $q.notify({ type: 'positive', message: 'Cập nhật báo cáo thành công' });
    } else {
      await weeklyReportApi.createDraft(form.value);
      $q.notify({ type: 'positive', message: 'Tạo dự thảo báo cáo thành công' });
    }
    formDialog.value.show = false;
    fetchMyReports();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Thao tác thất bại' });
  } finally {
    saving.value = false;
  }
};

const confirmSubmit = (row) => {
  confirmDialog.value = { show: true, report: row };
};

const executeSubmit = async () => {
  if (!confirmDialog.value.report) return;
  submitting.value = true;
  try {
    await weeklyReportApi.submitReport(confirmDialog.value.report.id);
    $q.notify({ type: 'positive', message: 'Nộp báo cáo tuần thành công!' });
    confirmDialog.value.show = false;
    fetchMyReports();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Không thể nộp báo cáo' });
  } finally {
    submitting.value = false;
  }
};

const openDetailDialog = async (row) => {
  try {
    const res = await weeklyReportApi.getMyReportDetail(row.id);
    selectedReport.value = res.data?.data || row;
    detailDialog.value.show = true;
  } catch (err) {
    selectedReport.value = row;
    detailDialog.value.show = true;
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
