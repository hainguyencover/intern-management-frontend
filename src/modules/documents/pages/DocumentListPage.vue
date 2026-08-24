<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Tài liệu & Hợp đồng Thực tập</h1>
        <p class="text-caption text-grey-7 q-mb-none">Quản lý CV, Giấy giới thiệu trường và Quy trình Ký kết hợp đồng thực tập số Bounded Lifecycle (US-009, US-010 & BR-07)</p>
      </div>
      <div class="q-gutter-x-sm">
        <q-btn v-if="!isIntern" color="secondary" icon="post_add" label="Tải lên / Thay thế Hợp đồng (HR)" @click="openUploadContractDialog" />
        <q-btn v-if="isIntern" color="primary" icon="upload_file" label="Nộp Tài liệu / CV" @click="openUploadDocDialog" />
      </div>
    </div>

    <!-- Navigation Tabs for Contracts & Documents -->
    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
      <q-tab name="documents" icon="description" label="Tài liệu & Hồ sơ ứng tuyển" />
      <q-tab name="contracts" icon="assignment_turned_in" label="Hợp đồng Thực tập & Ký kết (BR-07)" />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- TAB 1: DOCUMENTS -->
      <q-tab-panel name="documents" class="q-pa-none">
        <q-card flat bordered>
          <q-table
            :rows="documents"
            :columns="docColumns"
            row-key="id"
            :loading="loading"
            flat
            bordered
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="getDocStatusColor(props.value)" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right q-gutter-x-xs">
                <q-btn flat round dense icon="visibility" color="primary" @click="viewFile(props.row)">
                  <q-tooltip>Xem file</q-tooltip>
                </q-btn>
                <q-btn v-if="!isIntern && props.row.status === 'PENDING'" flat round dense icon="check" color="positive" @click="verifyDoc(props.row.id, 'APPROVED')">
                  <q-tooltip>Duyệt tài liệu</q-tooltip>
                </q-btn>
                <q-btn v-if="!isIntern && props.row.status === 'PENDING'" flat round dense icon="close" color="negative" @click="verifyDoc(props.row.id, 'REJECTED')">
                  <q-tooltip>Từ chối</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- TAB 2: CONTRACTS -->
      <q-tab-panel name="contracts" class="q-pa-none">
        <!-- Banner cảnh báo nếu hợp đồng bị yêu cầu chỉnh sửa -->
        <q-banner v-if="hasRevisionNeededContract" class="bg-negative text-white q-mb-md rounded-borders">
          <template #avatar>
            <q-icon name="report_problem" size="28px" />
          </template>
          <div class="text-bold text-subtitle2">⚠️ Hợp đồng bị Thực tập sinh yêu cầu chỉnh sửa!</div>
          <div>Thực tập sinh đã phản hồi yêu cầu điều chỉnh thông tin trong hợp đồng. Vui lòng bấm <strong>Thay thế Hợp đồng PDF (Replace)</strong> để upload bản cập nhật mới.</div>
        </q-banner>

        <q-card flat bordered>
          <q-table
            :rows="contracts"
            :columns="contractColumns"
            row-key="id"
            :loading="loading"
            flat
            bordered
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="getContractStatusColor(props.value)" text-color="white" size="sm">
                  {{ getContractStatusLabel(props.value) }}
                </q-chip>
                <div v-if="props.row.revisionReason" class="text-caption text-negative q-mt-xs">
                  💬 Ghi chú sửa: <em>{{ props.row.revisionReason }}</em>
                </div>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right q-gutter-x-xs">
                <!-- Inline Preview PDF (US-047) -->
                <q-btn flat round dense icon="preview" color="info" @click="previewContractPdf(props.row.id)">
                  <q-tooltip>Xem trước Hợp đồng PDF (Inline Preview)</q-tooltip>
                </q-btn>

                <!-- Download File PDF (US-056) -->
                <q-btn flat round dense icon="file_download" color="primary" @click="downloadContractPdf(props.row.id)">
                  <q-tooltip>Tải hợp đồng PDF về máy</q-tooltip>
                </q-btn>

                <!-- HR Replace PDF (US-048) -->
                <q-btn v-if="!isIntern && props.row.status !== 'SIGNED'" color="deep-orange" size="sm" icon="find_replace" label="Thay thế PDF" @click="openReplaceContractDialog(props.row)">
                  <q-tooltip>Upload đè file hợp đồng PDF sửa đổi (Replace PDF)</q-tooltip>
                </q-btn>

                <!-- HR Confirm (US-051) -->
                <q-btn v-if="!isIntern && props.row.status !== 'SIGNED' && props.row.status !== 'HR_CONFIRMED'" color="secondary" size="sm" icon="check_circle" label="HR Xác nhận" @click="confirmHrContract(props.row.id)">
                  <q-tooltip>HR xác nhận hợp đồng (BR-07)</q-tooltip>
                </q-btn>

                <!-- Intern Request Revision (US-060) -->
                <q-btn v-if="isIntern && props.row.status !== 'SIGNED'" color="negative" size="sm" icon="rate_review" label="Yêu cầu sửa" @click="openRevisionDialog(props.row.id)">
                  <q-tooltip>Yêu cầu HR sửa lại thông tin trong hợp đồng</q-tooltip>
                </q-btn>

                <!-- Intern Sign Online (US-010 / US-061) -->
                <q-btn v-if="isIntern && props.row.status !== 'SIGNED'" color="positive" size="sm" icon="draw" label="Ký xác nhận online" @click="signContract(props.row.id)">
                  <q-tooltip>Bật popup Ký xác nhận hợp đồng điện tử BR-07</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Modal 1: Upload Document Dialog -->
    <q-dialog v-model="showDocDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Nộp Tài liệu / Hồ sơ (PDF/DOCX &le; 10MB)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="uploadDoc" class="q-gutter-md">
            <q-select v-model="docForm.type" label="Loại tài liệu *" outlined dense emit-value map-options :options="docTypeOptions" />
            <q-file v-model="docFile" label="Chọn tệp tài liệu (*.pdf, *.docx)" outlined dense accept=".pdf,.docx">
              <template #prepend><q-icon name="attach_file" /></template>
            </q-file>
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Tải lên" color="primary" type="submit" :loading="uploading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal 2: Upload / Replace Contract Dialog (HR - US-009 / US-048) -->
    <q-dialog v-model="showContractDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">{{ isReplaceMode ? 'Thay thế Hợp đồng PDF (US-048)' : 'Tải lên Hợp đồng mới (US-009)' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="uploadContract" class="q-gutter-md">
            <div>
              <q-select
                v-model="contractForm.applicationId"
                label="Chọn Ứng viên / Đơn ứng tuyển *"
                outlined
                dense
                emit-value
                map-options
                :options="approvedApplicationsOptions"
                :loading="loadingApps"
                :disable="isReplaceMode"
                :rules="[val => !!val || 'Vui lòng chọn đơn ứng tuyển']"
              />
              <div v-if="!loadingApps && approvedApplications.length === 0" class="text-caption text-amber-9 q-mt-xs">
                ⚠️ Không tìm thấy đơn ứng tuyển nào.
              </div>
            </div>

            <q-file v-model="contractFile" label="Chọn file Hợp đồng PDF (*.pdf)" outlined dense accept=".pdf" :rules="[val => !!val || 'Bắt buộc chọn file PDF']">
              <template #prepend><q-icon name="picture_as_pdf" /></template>
            </q-file>
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn :label="isReplaceMode ? 'Thay thế Hợp đồng' : 'Tải lên Hợp đồng'" :color="isReplaceMode ? 'deep-orange' : 'secondary'" type="submit" :loading="uploading" :disable="!contractForm.applicationId" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal 3: Inline Preview PDF Modal (HR / Intern - US-047) -->
    <q-dialog v-model="showPreviewModal" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-9 text-white">
        <q-bar class="bg-primary text-white">
          <q-icon name="picture_as_pdf" />
          <div class="text-subtitle1 text-bold q-ml-sm">Xem trước Hợp đồng Thực tập PDF (US-047 Inline Preview)</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-pa-none" style="height: calc(100vh - 40px)">
          <iframe v-if="previewPdfUrl" :src="previewPdfUrl" style="width: 100%; height: 100%; border: none;"></iframe>
          <div v-else class="flex flex-center full-height">
            <q-spinner color="primary" size="40px" />
            <div class="q-mt-sm">Đang nạp dữ liệu PDF xem trước...</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal 4: Intern Request Revision Dialog (US-060) -->
    <q-dialog v-model="showRevisionModal">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold text-negative">Yêu cầu Chỉnh sửa Hợp đồng (US-060)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="text-caption text-grey-8">
            Nếu bạn phát hiện thông tin không chính xác (sai tên, sai trường, sai thời gian thực tập...), hãy mô tả chi tiết để HR kiểm tra và thay thế file hợp đồng mới.
          </p>
          <q-form @submit="submitRevisionRequest" class="q-gutter-md">
            <q-input
              v-model="revisionReason"
              label="Lý do & Nội dung cần chỉnh sửa *"
              type="textarea"
              outlined
              rows="4"
              :rules="[val => !!val && val.trim().length > 0 || 'Vui lòng nhập lý do']"
            />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Gửi Yêu cầu cho HR" color="negative" type="submit" :loading="submittingRevision" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';
import { useAuthStore } from '../../auth/store/authStore';
import { internDocumentApi } from '../../../api/internDocumentApi';
import { contractApi } from '../../../api/contractApi';

const $q = useQuasar();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const initialTab = (route.query.tab as string) || 'documents';
const tab = ref(initialTab);

watch(tab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } });
  }
});

const isIntern = computed(() => authStore.roles.includes('ROLE_INTERN') || authStore.roles.includes('INTERN'));
const loading = ref(false);
const uploading = ref(false);
const loadingApps = ref(false);
const submittingRevision = ref(false);
const isReplaceMode = ref(false);

const showDocDialog = ref(false);
const showContractDialog = ref(false);
const showPreviewModal = ref(false);
const showRevisionModal = ref(false);

const previewPdfUrl = ref('');
const activeContractIdForRevision = ref<number | null>(null);
const revisionReason = ref('');

const documents = ref([]);
const contracts = ref([]);
const approvedApplications = ref<any[]>([]);

const docFile = ref<File | null>(null);
const contractFile = ref<File | null>(null);

const docForm = ref({ type: 'CV' });
const contractForm = ref({ applicationId: null as number | null });

const hasRevisionNeededContract = computed(() => {
  return contracts.value.some((c: any) => c.status === 'NEEDS_REVISION');
});

const docTypeOptions = [
  { label: 'CV (Sơ yếu lý lịch)', value: 'CV' },
  { label: 'APPLICATION_LETTER (Đơn xin thực tập)', value: 'APPLICATION_LETTER' },
  { label: 'OTHER (Giấy tờ khác)', value: 'OTHER' }
];

const docColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'type', label: 'Loại tài liệu', field: 'type', align: 'left' },
  { name: 'fileUrl', label: 'Tệp đính kèm', field: 'fileUrl', align: 'left' },
  { name: 'status', label: 'Trạng thái duyệt', field: 'status', align: 'center' },
  { name: 'uploadedAt', label: 'Ngày tải lên', field: 'uploadedAt', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

const contractColumns = [
  { name: 'id', label: 'Mã HĐ', field: 'id', sortable: true },
  { name: 'applicationId', label: 'Mã Đơn ứng tuyển', field: 'applicationId', align: 'center' },
  { name: 'internName', label: 'Ứng viên', field: (row: any) => row.internName || 'Ứng viên', align: 'left' },
  { name: 'status', label: 'Trạng thái ký (BR-07)', field: 'status', align: 'center' },
  { name: 'signedAt', label: 'Ngày ký', field: 'signedAt', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

const approvedApplicationsOptions = computed(() => {
  return approvedApplications.value.map((app: any) => ({
    label: `${app.internName || 'Ứng viên'} — ${app.position || 'Vị trí'} (Đơn #${app.id} - ${app.status})`,
    value: app.id
  }));
});

function getDocStatusColor(status: string) {
  switch (status) {
    case 'APPROVED': return 'positive';
    case 'REJECTED': return 'negative';
    default: return 'warning';
  }
}

function getContractStatusColor(status: string) {
  switch (status) {
    case 'SIGNED': return 'positive';
    case 'HR_CONFIRMED': return 'info';
    case 'NEEDS_REVISION': return 'negative';
    case 'INTERN_CONFIRMED': return 'secondary';
    default: return 'warning';
  }
}

function getContractStatusLabel(status: string) {
  switch (status) {
    case 'SIGNED': return 'ĐÃ KÝ (SIGNED)';
    case 'HR_CONFIRMED': return 'HR ĐÃ XÁC NHẬN';
    case 'INTERN_CONFIRMED': return 'INTERN ĐÃ XÁC NHẬN';
    case 'NEEDS_REVISION': return 'YÊU CẦU SỬA (NEEDS REVISION)';
    case 'SENT': case 'PENDING_CONFIRMATION': return 'CHỜ XÁC NHẬN (PENDING)';
    default: return status || 'CHỜ XÁC NHẬN';
  }
}

async function loadData() {
  loading.value = true;
  try {
    // 1. Fetch Documents
    const docEndpoint = isIntern.value ? '/api/v1/intern/documents' : '/api/v1/hr/documents';
    const docRes = await api.get(docEndpoint).catch(() => null);
    if (docRes && docRes.data) {
      let rawDocs = docRes.data.data !== undefined ? docRes.data.data : docRes.data;
      if (rawDocs && rawDocs.content) {
        rawDocs = rawDocs.content;
      }
      documents.value = Array.isArray(rawDocs) ? rawDocs : [];
    }

    // 2. Fetch Contracts
    const contractEndpoint = isIntern.value ? '/api/v1/intern/contracts/current' : '/api/v1/contracts';
    const contractRes = await api.get(contractEndpoint).catch(() => null);
    if (contractRes && contractRes.data) {
      let rawContracts = contractRes.data.data !== undefined ? contractRes.data.data : contractRes.data;
      if (rawContracts && rawContracts.content) {
        rawContracts = rawContracts.content;
      }
      if (rawContracts && !Array.isArray(rawContracts)) {
        rawContracts = [rawContracts];
      }
      contracts.value = Array.isArray(rawContracts) ? rawContracts : [];
    }
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
}

function openUploadDocDialog() {
  docFile.value = null;
  docForm.value = { type: 'CV' };
  showDocDialog.value = true;
}

async function openUploadContractDialog() {
  isReplaceMode.value = false;
  contractFile.value = null;
  contractForm.value = { applicationId: null };
  showContractDialog.value = true;
  loadingApps.value = true;

  try {
    const res = await api.get('/api/v1/hr/applications', { params: { size: 100 } }).catch(() => null);
    if (res && res.data) {
      let list = res.data.data !== undefined ? res.data.data : res.data;
      if (list && list.content) {
        list = list.content;
      }
      const activeApps = Array.isArray(list) ? list.filter((a: any) => a.status !== 'REJECTED') : [];
      approvedApplications.value = activeApps;

      if (approvedApplications.value.length > 0) {
        contractForm.value.applicationId = approvedApplications.value[0].id;
      }
    }
  } catch (err) {
    console.error('Error loading applications:', err);
  } finally {
    loadingApps.value = false;
  }
}

function openReplaceContractDialog(row: any) {
  if (!row || !row.applicationId) return;
  isReplaceMode.value = true;
  contractFile.value = null;
  contractForm.value = { applicationId: row.applicationId };
  approvedApplications.value = [{ id: row.applicationId, internName: row.internName, position: 'Vị trí' }];
  showContractDialog.value = true;
}

async function uploadDoc() {
  if (!docFile.value) {
    $q.notify({ type: 'warning', message: 'Vui lòng chọn tệp tài liệu PDF hoặc DOCX' });
    return;
  }

  const maxBytes = 10 * 1024 * 1024;
  if (docFile.value.size > maxBytes) {
    $q.notify({ type: 'negative', message: 'Dung lượng file vượt quá 10MB theo quy định US-004' });
    return;
  }

  const name = docFile.value.name.toLowerCase();
  if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
    $q.notify({ type: 'negative', message: 'Định dạng file không hợp lệ (chỉ chấp nhận .pdf hoặc .docx)' });
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', docFile.value);
    formData.append('type', docForm.value.type);

    await api.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    $q.notify({ type: 'positive', message: 'Tải lên tài liệu hồ sơ thành công!' });
    showDocDialog.value = false;
    await loadData();
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Tải tài liệu thất bại';
    $q.notify({ type: 'negative', message: msg });
  } finally {
    uploading.value = false;
  }
}

async function uploadContract() {
  if (!contractFile.value) {
    $q.notify({ type: 'warning', message: 'Vui lòng chọn file hợp đồng PDF' });
    return;
  }
  if (!contractForm.value.applicationId) {
    $q.notify({ type: 'warning', message: 'Vui lòng chọn đơn ứng tuyển' });
    return;
  }

  const name = contractFile.value.name.toLowerCase();
  if (!name.endsWith('.pdf')) {
    $q.notify({ type: 'negative', message: 'Hợp đồng thực tập bắt buộc phải ở định dạng PDF (.pdf)' });
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', contractFile.value);

    await api.post(`/api/v1/hr/applications/${contractForm.value.applicationId}/contract`, formData);
    $q.notify({
      type: 'positive',
      message: isReplaceMode.value ? 'Thay thế Hợp đồng PDF mới thành công!' : 'Tải lên Hợp đồng thực tập PDF thành công!'
    });
    showContractDialog.value = false;
    await loadData();
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Tải hợp đồng thất bại.';
    $q.notify({ type: 'negative', message: msg });
  } finally {
    uploading.value = false;
  }
}

async function verifyDoc(id: number, decision: string) {
  try {
    await api.post(`/api/v1/documents/${id}/verify`, { decision, note: 'Duyệt hồ sơ' });
    $q.notify({ type: 'positive', message: 'Xác thực tài liệu thành công' });
    await loadData();
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Thao tác thất bại' });
  }
}

async function confirmHrContract(id: number) {
  try {
    await api.post(`/api/v1/hr/contracts/${id}/confirm`);
    $q.notify({ type: 'positive', message: 'HR xác nhận hợp đồng thành công!' });
    await loadData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err.response?.data?.error?.message || err.response?.data?.message || 'HR xác nhận thất bại' });
  }
}

async function signContract(id: number) {
  $q.dialog({
    title: 'Xác nhận Ký Hợp đồng Điện tử (BR-07)',
    message: 'Bạn có chắc chắn đã kiểm tra kỹ các điều khoản và đồng ý Ký xác nhận hợp đồng này không?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.post(`/api/v1/intern/contracts/${id}/confirm`);
      $q.notify({ type: 'positive', message: 'Ký xác nhận hợp đồng điện tử thành công! Bạn đã chính thức làm Thực tập sinh (INTERNING).' });
      await loadData();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: err.response?.data?.error?.message || err.response?.data?.message || 'Ký hợp đồng thất bại' });
    }
  });
}

function openRevisionDialog(contractId: number) {
  activeContractIdForRevision.value = contractId;
  revisionReason.value = '';
  showRevisionModal.value = true;
}

async function submitRevisionRequest() {
  if (!activeContractIdForRevision.value || !revisionReason.value.trim()) return;
  submittingRevision.value = true;
  try {
    await contractApi.requestRevision(activeContractIdForRevision.value, revisionReason.value.trim());
    $q.notify({ type: 'positive', message: 'Đã gửi Yêu cầu chỉnh sửa hợp đồng tới bộ phận HR thành công!' });
    showRevisionModal.value = false;
    await loadData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err.response?.data?.error?.message || 'Gửi yêu cầu thất bại' });
  } finally {
    submittingRevision.value = false;
  }
}

async function previewContractPdf(contractId: number) {
  if (!contractId) return;
  try {
    showPreviewModal.value = true;
    previewPdfUrl.value = '';
    const res = await contractApi.previewFile(contractId);
    if (res && res.data) {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      previewPdfUrl.value = window.URL.createObjectURL(blob);
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể tải file PDF xem trước' });
  }
}

function downloadContractPdf(contractId: number) {
  if (!contractId) return;
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
  window.open(`/api/v1/contracts/${contractId}/download?access_token=${token}`, '_blank');
}

async function viewFile(item: any) {
  if (!item) {
    $q.notify({ type: 'info', message: 'Chưa có tài liệu để xem' });
    return;
  }

  if (typeof item === 'object' && item.id) {
    try {
      if ($q.loading) {
        $q.loading.show({ message: 'Đang tải tài liệu...' });
      }
      const res = await internDocumentApi.downloadDocument({
        id: item.id,
        isHr: !isIntern.value
      });
      if (res && res.data) {
        const contentType = res.headers?.['content-type'] || 'application/pdf';
        const blob = new Blob([res.data], { type: contentType });
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } else {
        $q.notify({ type: 'negative', message: 'Tài liệu không khả thi' });
      }
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Không thể tải file tài liệu' });
    } finally {
      if ($q.loading) {
        $q.loading.hide();
      }
    }
    return;
  }
}

onMounted(() => {
  loadData();
});
</script>
