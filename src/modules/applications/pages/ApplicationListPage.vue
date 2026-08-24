<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Quản lý Đơn Ứng tuyển & Xét duyệt</h1>
        <p class="text-caption text-grey-7 q-mb-none">Tiếp nhận đơn ứng tuyển trực tuyến, AI CV Screening & HR Phê duyệt (BR-02 & BR-05)</p>
      </div>
      <q-btn v-if="isIntern" color="primary" icon="send" label="Nộp đơn ứng tuyển mới" @click="openSubmitDialog" />
    </div>

    <!-- Review Queue KPI Summary Header (US-052) -->
    <div v-if="!isIntern && queueStats" class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-blue-1 text-primary">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Chờ duyệt (Submitted)</div>
            <div class="text-h6 text-bold">{{ queueStats.pendingReviewCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-purple-1 text-purple-9">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Đang rà soát (Reviewing)</div>
            <div class="text-h6 text-bold">{{ queueStats.inReviewCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-orange-1 text-orange-9">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Cần bổ sung (Revision)</div>
            <div class="text-h6 text-bold">{{ queueStats.needsRevisionCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-red-1 text-negative">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Quá hạn SLA (>3 ngày)</div>
            <div class="text-h6 text-bold">{{ queueStats.overdueCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-green-1 text-positive">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Duyệt hôm nay</div>
            <div class="text-h6 text-bold">{{ queueStats.approvedTodayCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <q-card flat bordered class="bg-grey-3 text-grey-9">
          <q-card-section class="q-pa-sm text-center">
            <div class="text-caption text-bold">Từ chối hôm nay</div>
            <div class="text-h6 text-bold">{{ queueStats.rejectedTodayCount }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filter Card -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-input v-model="keyword" dense outlined placeholder="Tìm kiếm vị trí, ứng viên..." @keyup.enter="loadApplications">
            <template #append>
              <q-icon name="search" class="cursor-pointer" @click="loadApplications" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="statusFilter"
            dense
            outlined
            emit-value
            map-options
            :options="statusOptions"
            label="Trạng thái đơn"
            @update:model-value="loadApplications"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-btn outline color="primary" label="Làm mới danh sách" icon="refresh" class="full-width" @click="loadApplications" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Data Table -->
    <q-card flat bordered>
      <q-table
        :rows="applications"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="getStatusColor(props.value)" text-color="white" size="sm" class="text-bold">
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-aiScore="props">
          <q-td :props="props" class="text-center">
            <q-badge :color="props.value >= 75 ? 'positive' : 'warning'" class="text-bold">
              {{ props.value ? props.value + '%' : 'N/A' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right q-gutter-x-xs">
            <!-- Start Review button (US-048) -->
            <q-btn v-if="!isIntern && props.row.status === 'SUBMITTED'" flat round dense icon="play_arrow" color="purple" @click="startReview(props.row.id)">
              <q-tooltip>US-048: Bắt đầu rà soát (Chuyển Reviewing)</q-tooltip>
            </q-btn>

            <!-- Eligibility Screening button (US-049) -->
            <q-btn v-if="!isIntern" flat round dense icon="fact_check" color="teal" @click="openEligibilityModal(props.row)">
              <q-tooltip>US-049: Kiểm tra điều kiện sơ tuyển (Eligibility Engine)</q-tooltip>
            </q-btn>

            <!-- Review / Approve / Reject button (US-007) -->
            <q-btn v-if="!isIntern && ['SUBMITTED', 'REVIEWING'].includes(props.row.status)" flat round dense icon="gavel" color="primary" @click="openReviewDialog(props.row)">
              <q-tooltip>US-007: Phê duyệt / Từ chối (HR Decision)</q-tooltip>
            </q-btn>

            <!-- Request Revision button (US-050) -->
            <q-btn v-if="!isIntern && props.row.status === 'REVIEWING'" flat round dense icon="edit_note" color="warning" @click="openRevisionModal(props.row)">
              <q-tooltip>US-050: Yêu cầu ứng viên bổ sung hồ sơ</q-tooltip>
            </q-btn>

            <!-- Audit History button (US-051) -->
            <q-btn flat round dense icon="history" color="grey-8" @click="openHistoryModal(props.row)">
              <q-tooltip>US-051: Lịch sử xét duyệt & Audit Trail</q-tooltip>
            </q-btn>

            <!-- AI Rescan -->
            <q-btn v-if="!isIntern" flat round dense icon="psychology" color="secondary" @click="rescanAi(props.row.id)">
              <q-tooltip>Kích hoạt AI Screen CV</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Submit Application Dialog (Intern/Candidate) -->
    <q-dialog v-model="showSubmitDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Nộp đơn ứng tuyển Thực tập</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="submitApplication" class="q-gutter-md">
            <q-input v-model="submitForm.position" label="Vị trí ứng tuyển *" outlined dense placeholder="VD: Fullstack Java / Vue.js Intern" :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model.number="submitForm.programId" label="ID Chương trình Thực tập *" type="number" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            
            <!-- Option 1: File from hard drive -->
            <div class="q-pa-sm bg-grey-2 rounded-borders">
              <div class="text-caption text-bold text-primary q-mb-xs">
                <q-icon name="cloud_upload" /> Lựa chọn 1: Tải tệp CV từ máy tính (Ổ cứng)
              </div>
              <q-file v-model="submitCvFile" outlined dense bg-color="white" label="Chọn tệp CV từ máy tính (.pdf, .doc, .docx)" accept=".pdf,.doc,.docx" clearable>
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>

            <!-- Option 2: Drive link -->
            <div class="q-pa-sm bg-grey-2 rounded-borders">
              <div class="text-caption text-bold text-teal q-mb-xs">
                <q-icon name="link" /> Lựa chọn 2: Dùng đường link CV xem trực tuyến (Google Drive / Cloud)
              </div>
              <q-input v-model="submitForm.cvUrl" outlined dense bg-color="white" placeholder="https://drive.google.com/file/d/..." hint="Đường dẫn xem CV trực tuyến cho HR duyệt hồ sơ (US-007-AC-03)" />
            </div>

            <q-input v-model="submitForm.note" label="Ghi chú / Giới thiệu bản thân" type="textarea" outlined dense rows="2" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Nộp đơn" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- HR Review Dialog -->
    <q-dialog v-model="showReviewDialog">
      <q-card style="min-width: 520px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Xét duyệt Đơn ứng tuyển (BR-05)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-banner rounded class="bg-blue-1 text-blue-9 q-mb-md">
            <div><strong>Ứng viên:</strong> {{ selectedApp?.internName || 'Ứng viên' }}</div>
            <div><strong>Vị trí ứng tuyển:</strong> {{ selectedApp?.position }}</div>
            <div><strong>Trạng thái hiện tại:</strong> {{ selectedApp?.status }}</div>
            <div v-if="selectedApp?.aiScore"><strong>AI Match Score:</strong> {{ selectedApp?.aiScore }}%</div>
          </q-banner>

          <q-form @submit="submitReview" class="q-gutter-md">
            <q-select
              v-model="reviewForm.decision"
              label="Quyết định xét duyệt *"
              outlined
              dense
              emit-value
              map-options
              :options="[
                { label: 'APPROVE (Phê duyệt nhận ứng viên)', value: 'APPROVE' },
                { label: 'REJECT (Từ chối hồ sơ)', value: 'REJECT' }
              ]"
            />
            <q-input
              v-model="reviewForm.comment"
              :label="reviewForm.decision === 'REJECT' ? 'Lý do từ chối (Bắt buộc) *' : 'Nhận xét / Ghi chú xét duyệt *'"
              type="textarea"
              outlined
              dense
              rows="3"
              :rules="[val => (!!val && val.trim().length >= 5) || 'Vui lòng nhập lý do/nhận xét tối thiểu 5 ký tự']"
            />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Xác nhận kết quả" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Eligibility Screening Modal (US-049) -->
    <q-dialog v-model="showEligibilityDialog">
      <q-card style="min-width: 520px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold text-teal">
            <q-icon name="fact_check" class="q-mr-xs" /> US-049: Result Eligibility Screening Engine
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-banner :class="eligibilityData?.eligible ? 'bg-green-1 text-positive' : 'bg-orange-1 text-orange-9'" class="rounded-borders q-mb-md">
            <template #avatar>
              <q-icon :name="eligibilityData?.eligible ? 'check_circle' : 'warning'" :color="eligibilityData?.eligible ? 'positive' : 'warning'" />
            </template>
            <div class="text-subtitle1 text-bold">
              {{ eligibilityData?.eligible ? 'ĐỦ ĐIỀU KIỆN SƠ TUYỂN (ELIGIBLE)' : 'CHƯA ĐẠT ĐIỀU KIỆN (NOT ELIGIBLE)' }}
            </div>
            <div class="text-caption">Ứng viên: {{ selectedApp?.internName }} | Mã đơn: APP-{{ selectedApp?.id }}</div>
          </q-banner>

          <div class="text-subtitle2 text-bold q-mb-xs">Danh sách Tiêu chí Rà soát Tự động:</div>
          <q-list separator bordered rounded-borders class="bg-white">
            <q-item v-for="check in eligibilityData?.checks || []" :key="check.rule">
              <q-item-section avatar>
                <q-icon :name="check.passed ? 'check_circle' : 'cancel'" :color="check.passed ? 'positive' : 'negative'" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ check.rule }}</q-item-label>
                <q-item-label caption :class="check.passed ? 'text-grey-8' : 'text-negative text-bold'">{{ check.message }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip dense :color="check.passed ? 'positive' : 'negative'" text-color="white" size="xs" class="text-bold">
                  {{ check.passed ? 'PASSED' : 'FAILED' }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="row justify-end q-mt-md">
            <q-btn label="Đóng" flat v-close-popup />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Request Revision Modal (US-050) -->
    <q-dialog v-model="showRevisionDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold text-orange-9">
            <q-icon name="edit_note" class="q-mr-xs" /> US-050: Yêu cầu Ứng viên Bổ sung Hồ sơ
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="submitRevision" class="q-gutter-md">
            <q-input
              v-model="revisionComment"
              label="Nội dung/Lý do yêu cầu bổ sung (Bắt buộc) *"
              type="textarea"
              outlined
              dense
              rows="3"
              placeholder="VD: Vui lòng bổ sung bảng điểm GPA học tập và đính kèm CV bản mềm đầy đủ."
              :rules="[val => (!!val && val.trim().length >= 5) || 'Vui lòng nhập ghi chú tối thiểu 5 ký tự']"
            />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Gửi Yêu cầu Bổ sung" color="warning" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Status Audit History Modal (US-051) -->
    <q-dialog v-model="showHistoryDialog">
      <q-card style="min-width: 520px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold text-primary">
            <q-icon name="history" class="q-mr-xs" /> US-051: Lịch sử Chuyển Trạng thái & Audit Trail
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey-8 q-mb-md">Lịch sử vết quy trình cho Mã đơn: <strong>APP-{{ selectedApp?.id }}</strong> (Ứng viên: {{ selectedApp?.internName }})</div>
          
          <q-timeline color="primary" dense>
            <q-timeline-entry
              v-for="item in historyData"
              :key="item.id"
              :title="(item.fromStatus || 'DRAFT') + ' ➔ ' + item.toStatus"
              :subtitle="formatDate(item.createdAt) + ' — Bởi: ' + (item.changedByName || 'Hệ thống')"
              :color="getStatusColor(item.toStatus)"
            >
              <div v-if="item.reason" class="text-body2 text-grey-9 q-mt-xs bg-grey-2 q-pa-xs rounded-borders">
                Ghi chú: {{ item.reason }}
              </div>
            </q-timeline-entry>
          </q-timeline>

          <div v-if="historyData.length === 0" class="text-center text-grey-6 q-pa-md">
            Chưa có ghi nhận lịch sử thay đổi trạng thái
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn label="Đóng" flat v-close-popup />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';
import { useAuthStore } from '../../auth/store/authStore';

const $q = useQuasar();
const authStore = useAuthStore();

const isIntern = computed(() => authStore.roles.includes('ROLE_INTERN') || authStore.roles.includes('INTERN'));
const loading = ref(false);
const saving = ref(false);
const showSubmitDialog = ref(false);
const showReviewDialog = ref(false);
const showEligibilityDialog = ref(false);
const showRevisionDialog = ref(false);
const showHistoryDialog = ref(false);
const submitCvFile = ref<File | null>(null);

const keyword = ref('');
const statusFilter = ref('');
const applications = ref([]);
const selectedApp = ref<any>(null);
const queueStats = ref<any>(null);
const eligibilityData = ref<any>(null);
const historyData = ref<any[]>([]);
const revisionComment = ref('');

const submitForm = ref({
  position: 'Software Engineer Intern',
  programId: 1,
  cvUrl: '',
  note: 'Kính gửi HR, tôi mong muốn được tham gia đợt thực tập.'
});

const reviewForm = ref({
  decision: 'APPROVE',
  comment: 'Hồ sơ phù hợp với yêu cầu đầu vào.'
});

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'SUBMITTED (Đã nộp)', value: 'SUBMITTED' },
  { label: 'REVIEWING (Đang duyệt)', value: 'REVIEWING' },
  { label: 'NEEDS_REVISION (Cần bổ sung)', value: 'NEEDS_REVISION' },
  { label: 'APPROVED (Được nhận)', value: 'APPROVED' },
  { label: 'REJECTED (Bị từ chối)', value: 'REJECTED' }
];

const columns = [
  { name: 'id', label: 'Mã Đơn', field: 'id', sortable: true },
  { name: 'internName', label: 'Họ tên Ứng viên', field: 'internName', align: 'left' },
  { name: 'position', label: 'Vị trí Ứng tuyển', field: 'position', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'aiScore', label: 'AI Match Score', field: 'aiScore', align: 'center' },
  { name: 'appliedAt', label: 'Ngày nộp', field: 'appliedAt', align: 'center' },
  { name: 'actions', label: 'Thao tác HR', field: 'actions', align: 'right' }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'SUBMITTED': return 'info';
    case 'REVIEWING': return 'purple';
    case 'NEEDS_REVISION': return 'warning';
    case 'APPROVED': return 'positive';
    case 'REJECTED': return 'negative';
    default: return 'grey';
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN');
}

async function loadQueueStats() {
  if (isIntern.value) return;
  try {
    const res = await api.get('/api/v1/applications/queue');
    if (res.data && res.data.data) {
      queueStats.value = res.data.data;
    }
  } catch (err) {
    console.error('Error loading queue stats', err);
  }
}

async function loadApplications() {
  loading.value = true;
  try {
    await loadQueueStats();
    const endpoint = isIntern.value ? '/api/v1/applications/me' : '/api/v1/applications';
    const res = await api.get(endpoint, {
      params: {
        keyword: keyword.value || undefined,
        status: statusFilter.value || undefined
      }
    });
    if (res.data && res.data.data) {
      applications.value = res.data.data.content || res.data.data;
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách đơn ứng tuyển' });
  } finally {
    loading.value = false;
  }
}

async function startReview(appId: number) {
  try {
    await api.post(`/api/v1/applications/${appId}/start-review`);
    $q.notify({ type: 'positive', message: 'Đã bắt đầu rà soát đơn ứng tuyển (REVIEWING)' });
    await loadApplications();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể bắt đầu rà soát' });
  }
}

async function openEligibilityModal(app: any) {
  selectedApp.value = app;
  eligibilityData.value = null;
  showEligibilityDialog.value = true;
  try {
    const res = await api.get(`/api/v1/applications/${app.id}/eligibility`);
    if (res.data && res.data.data) {
      eligibilityData.value = res.data.data;
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể kiểm tra điều kiện sơ tuyển' });
  }
}

function openRevisionModal(app: any) {
  selectedApp.value = app;
  revisionComment.value = '';
  showRevisionDialog.value = true;
}

async function submitRevision() {
  if (!revisionComment.value || revisionComment.value.trim().length < 5) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập lý do bổ sung tối thiểu 5 ký tự' });
    return;
  }
  saving.value = true;
  try {
    await api.post(`/api/v1/applications/${selectedApp.value.id}/request-revision`, null, {
      params: { comment: revisionComment.value }
    });
    $q.notify({ type: 'positive', message: 'Đã gửi yêu cầu bổ sung hồ sơ tới ứng viên!' });
    showRevisionDialog.value = false;
    await loadApplications();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Lỗi gửi yêu cầu bổ sung' });
  } finally {
    saving.value = false;
  }
}

async function openHistoryModal(app: any) {
  selectedApp.value = app;
  historyData.value = [];
  showHistoryDialog.value = true;
  try {
    const res = await api.get(`/api/v1/applications/${app.id}/history`);
    if (res.data && res.data.data) {
      historyData.value = res.data.data;
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải lịch sử xét duyệt' });
  }
}

function openSubmitDialog() {
  submitCvFile.value = null;
  submitForm.value = {
    position: 'Software Engineer Intern',
    programId: 1,
    cvUrl: '',
    note: 'Kính gửi HR, tôi mong muốn được tham gia đợt thực tập.'
  };
  showSubmitDialog.value = true;
}

async function submitApplication() {
  if (!submitForm.value.position || submitForm.value.position.trim().length < 3) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập vị trí ứng tuyển hợp lệ (tối thiểu 3 ký tự)' });
    return;
  }
  if (!submitForm.value.programId || submitForm.value.programId <= 0) {
    $q.notify({ type: 'warning', message: 'Vui lòng chọn hoặc nhập ID Chương trình Thực tập hợp lệ' });
    return;
  }

  saving.value = true;
  try {
    // If local file picked -> Upload first to /api/v1/intern/documents/upload
    if (submitCvFile.value) {
      const formData = new FormData();
      formData.append('file', submitCvFile.value);
      formData.append('type', 'CV');
      const uploadRes = await api.post('/api/v1/intern/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data && uploadRes.data.data && uploadRes.data.data.fileUrl) {
        submitForm.value.cvUrl = uploadRes.data.data.fileUrl;
      }
    }

    if (submitForm.value.cvUrl && submitForm.value.cvUrl.trim().length > 0) {
      try {
        await api.put('/api/v1/interns/me', { cvUrl: submitForm.value.cvUrl.trim() });
      } catch (e) {
        console.warn('Could not auto-sync CV URL to profile:', e);
      }
    }
    await api.post('/api/v1/applications', submitForm.value);
    $q.notify({ type: 'positive', message: 'Nộp đơn ứng tuyển trực tuyến thành công (US-006 / BR-02)' });
    showSubmitDialog.value = false;
    await loadApplications();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Nộp đơn thất bại' });
  } finally {
    saving.value = false;
  }
}

function openReviewDialog(row: any) {
  selectedApp.value = row;
  reviewForm.value = { decision: 'APPROVE', comment: 'Hồ sơ phù hợp với yêu cầu đầu vào.' };
  showReviewDialog.value = true;
}

async function submitReview() {
  if (!selectedApp.value) return;
  saving.value = true;
  try {
    await api.post(`/api/v1/applications/${selectedApp.value.id}/review`, reviewForm.value);
    $q.notify({ type: 'positive', message: 'Đã cập nhật kết quả xét duyệt đơn thành công (BR-05)' });
    showReviewDialog.value = false;
    await loadApplications();
  } catch (err: any) {
    const errorMsg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Xét duyệt đơn thất bại';
    $q.notify({ type: 'negative', message: errorMsg });
  } finally {
    saving.value = false;
  }
}

async function rescanAi(id: number) {
  try {
    await api.post(`/api/v1/applications/${id}/ai-rescan`);
    $q.notify({ type: 'positive', message: 'Đã kích hoạt AI Screening CV thành công' });
    await loadApplications();
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Kích hoạt AI Screen thất bại' });
  }
}

onMounted(() => {
  loadApplications();
});
</script>
