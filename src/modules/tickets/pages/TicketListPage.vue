<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Quản lý Yêu cầu Hỗ trợ (US-027 & US-028)</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Gửi, tiếp nhận và xử lý yêu cầu chứng nhận, phụ cấp, nghỉ phép (BR-08 SLA 3 ngày làm việc)
        </p>
      </div>
      <q-btn v-if="isIntern" color="primary" icon="add" label="Tạo yêu cầu hỗ trợ" @click="openCreateDialog" />
    </div>

    <!-- Filter Toolbar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-3">
          <q-input v-model="keyword" dense outlined placeholder="Tìm theo Mã SUP-xxx, Tiêu đề..." @keyup.enter="loadTickets">
            <template #append>
              <q-icon name="search" class="cursor-pointer" @click="loadTickets" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-2">
          <q-select
            v-model="statusFilter"
            dense
            outlined
            emit-value
            map-options
            :options="statusOptions"
            label="Trạng thái"
            @update:model-value="loadTickets"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="categoryFilter"
            dense
            outlined
            emit-value
            map-options
            :options="categoryOptions"
            label="Danh mục"
            @update:model-value="loadTickets"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            v-model="priorityFilter"
            dense
            outlined
            emit-value
            map-options
            :options="priorityOptions"
            label="Mức ưu tiên"
            @update:model-value="loadTickets"
          />
        </div>

        <div class="col-12 col-md-2 row items-center justify-end">
          <q-checkbox v-if="!isIntern" v-model="overdueFilter" label="Chỉ Quá SLA" color="negative" @update:model-value="loadTickets" />
          <q-btn flat round dense icon="refresh" color="primary" @click="loadTickets">
            <q-tooltip>Tải lại</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- Data Table -->
    <q-card flat bordered>
      <q-table
        :rows="tickets"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template #body-cell-ticketCode="props">
          <q-td :props="props">
            <span class="text-bold text-primary font-mono">{{ props.value || `SUP-${props.row.id}` }}</span>
          </q-td>
        </template>

        <template #body-cell-priority="props">
          <q-td :props="props">
            <q-chip
              dense
              size="sm"
              :color="getPriorityColor(props.value)"
              text-color="white"
            >
              {{ props.value || 'MEDIUM' }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-slaStatus="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'OVERDUE' ? 'negative' : props.value === 'AT_RISK' ? 'warning' : 'positive'"
              class="q-pa-xs"
            >
              {{ props.value === 'OVERDUE' ? 'Quá SLA 3 ngày' : props.value === 'AT_RISK' ? 'Sắp hết hạn' : 'Đúng hạn' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="getStatusColor(props.value)" text-color="white" size="sm">
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right q-gutter-x-xs">
            <q-btn flat round dense icon="visibility" color="primary" @click="openDetailDialog(props.row)">
              <q-tooltip>Xem chi tiết & Trao đổi</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!isIntern && props.row.status === 'OPEN'"
              flat round dense icon="person_add" color="secondary" @click="assignTicket(props.row.id)"
            >
              <q-tooltip>Tiếp nhận & Phân công HR</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!isIntern && props.row.status !== 'RESOLVED' && props.row.status !== 'CLOSED'"
              flat round dense icon="check_circle" color="positive" @click="openResolveDialog(props.row)"
            >
              <q-tooltip>Giải quyết (Resolve)</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Create Ticket Dialog (Intern) -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6 text-bold">Tạo Yêu cầu Hỗ trợ (US-027)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="createTicket" class="q-gutter-md">
            <q-select
              v-model="createForm.category"
              label="Loại yêu cầu *"
              outlined
              dense
              emit-value
              map-options
              :options="categoryOptions.filter(o => o.value !== '')"
              :rules="[val => !!val || 'Vui lòng chọn loại yêu cầu']"
            />

            <q-select
              v-model="createForm.priority"
              label="Mức ưu tiên"
              outlined
              dense
              emit-value
              map-options
              :options="priorityOptions.filter(o => o.value !== '')"
            />

            <q-input
              v-model="createForm.title"
              label="Tiêu đề *"
              outlined
              dense
              hint="Từ 5 đến 200 ký tự"
              :rules="[val => (val && val.trim().length >= 5 && val.trim().length <= 200) || 'Tiêu đề từ 5 - 200 ký tự']"
            />

            <q-input
              v-model="createForm.content"
              label="Nội dung chi tiết *"
              type="textarea"
              outlined
              dense
              rows="4"
              hint="Tối thiểu 10 ký tự"
              :rules="[val => (val && val.trim().length >= 10) || 'Nội dung tối thiểu 10 ký tự']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Gửi yêu cầu" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Detail & Comments Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 650px; max-width: 800px">
        <q-card-section class="row items-center bg-grey-2">
          <div>
            <div class="row items-center q-gutter-x-sm">
              <span class="text-subtitle1 text-bold text-primary font-mono">{{ selectedTicket?.ticketCode }}</span>
              <q-chip dense :color="getStatusColor(selectedTicket?.status)" text-color="white" size="sm">
                {{ getStatusLabel(selectedTicket?.status) }}
              </q-chip>
            </div>
            <div class="text-h6 text-bold q-mt-xs">{{ selectedTicket?.title }}</div>
            <div class="text-caption text-grey-7">
              Người tạo: {{ selectedTicket?.creatorName || 'TTS' }} • Phân công HR: {{ selectedTicket?.assignedToName || 'Chưa phân công' }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <!-- Main Content -->
          <div class="text-subtitle2 text-bold text-grey-8">Nội dung chi tiết:</div>
          <q-banner rounded class="bg-grey-1 text-grey-9 q-mb-md border">
            {{ selectedTicket?.content }}
          </q-banner>

          <!-- Resolution Section -->
          <div v-if="selectedTicket?.resolution" class="q-mb-md">
            <div class="text-subtitle2 text-bold text-positive">Phương án xử lý từ HR:</div>
            <q-banner rounded class="bg-green-1 text-green-10 border border-green-3">
              {{ selectedTicket?.resolution }}
            </q-banner>
            <div v-if="isIntern && selectedTicket?.status === 'RESOLVED'" class="row justify-end q-mt-xs">
              <q-btn color="positive" label="Xác nhận hài lòng & Đóng yêu cầu" size="sm" icon="check" @click="closeTicket(selectedTicket.id)" />
            </div>
          </div>

          <!-- Discussion Timeline -->
          <div class="text-subtitle2 text-bold q-mb-sm">Lịch sử trao đổi & Ghi chú:</div>
          <q-list separator class="q-mb-md bg-grey-1 rounded-borders q-pa-sm" style="max-height: 250px; overflow-y: auto;">
            <q-item v-for="c in comments" :key="c.id" :class="c.isInternal ? 'bg-amber-1 rounded-borders' : ''">
              <q-item-section avatar>
                <q-avatar :color="c.isInternal ? 'amber-8' : 'primary'" text-color="white" size="sm">
                  {{ c.authorName?.charAt(0) || 'U' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ c.authorName }}
                  <span v-if="c.isInternal" class="text-caption text-amber-9 font-bold"> [Ghi chú nội bộ HR]</span>
                  <span class="text-caption text-grey-6"> • {{ c.createdAt }}</span>
                </q-item-label>
                <q-item-label caption class="text-body2 text-grey-9">{{ c.content }}</q-item-label>
              </q-item-section>
            </q-item>
            <div v-if="comments.length === 0" class="text-caption text-grey-6 text-center q-pa-sm">Chưa có phản hồi nào.</div>
          </q-list>

          <!-- Input Reply -->
          <div v-if="selectedTicket?.status !== 'CLOSED'" class="column q-gutter-y-xs">
            <div v-if="!isIntern" class="row items-center">
              <q-checkbox v-model="isInternalNote" label="Ghi chú nội bộ HR (Thực tập sinh không nhìn thấy)" color="amber" dense size="sm" />
            </div>
            <div class="row q-gutter-x-sm">
              <q-input
                v-model="newComment"
                dense
                outlined
                :placeholder="isInternalNote ? 'Nhập ghi chú nội bộ phòng HR...' : 'Nhập phản hồi trao đổi...'"
                class="col"
                @keyup.enter="addComment"
              />
              <q-btn :color="isInternalNote ? 'amber-9' : 'primary'" label="Gửi" icon="send" :loading="commenting" @click="addComment" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </dialog>

    <!-- Resolve Modal (HR) -->
    <q-dialog v-model="showResolveDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center bg-positive text-white">
          <div class="text-h6 text-bold">Đưa ra kết quả xử lý (Resolve)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="resolveTicket" class="q-gutter-md">
            <q-input
              v-model="resolveText"
              label="Mô tả phương án / Kết quả giải quyết *"
              type="textarea"
              outlined
              dense
              rows="4"
              hint="VD: Đã cấp chứng nhận và gửi bản mềm đính kèm"
              :rules="[val => (val && val.trim().length >= 5) || 'Vui lòng nhập tối thiểu 5 ký tự']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Hoàn tất Resolve" color="positive" type="submit" :loading="resolving" />
            </div>
          </q-form>
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
const commenting = ref(false);
const resolving = ref(false);

const showCreateDialog = ref(false);
const showDetailDialog = ref(false);
const showResolveDialog = ref(false);

const keyword = ref('');
const statusFilter = ref('');
const categoryFilter = ref('');
const priorityFilter = ref('');
const overdueFilter = ref(false);

const tickets = ref([]);
const selectedTicket = ref<any>(null);
const comments = ref<any[]>([]);
const newComment = ref('');
const isInternalNote = ref(false);
const resolveText = ref('');

const createForm = ref({
  category: 'CERTIFICATE',
  priority: 'MEDIUM',
  title: '',
  content: ''
});

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xử lý (OPEN)', value: 'OPEN' },
  { label: 'Đang xử lý (IN_PROGRESS)', value: 'IN_PROGRESS' },
  { label: 'Đã xử lý (RESOLVED)', value: 'RESOLVED' },
  { label: 'Đã đóng (CLOSED)', value: 'CLOSED' }
];

const categoryOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Chứng nhận / Dấu mộc (CERTIFICATE)', value: 'CERTIFICATE' },
  { label: 'Giấy tờ (DOCUMENT)', value: 'DOCUMENT' },
  { label: 'Xác nhận thực tập (INTERNSHIP_CONFIRMATION)', value: 'INTERNSHIP_CONFIRMATION' },
  { label: 'Phụ cấp / Lương (ALLOWANCE)', value: 'ALLOWANCE' },
  { label: 'Chấm công (ATTENDANCE)', value: 'ATTENDANCE' },
  { label: 'Nghỉ phép (LEAVE)', value: 'LEAVE' },
  { label: 'Hợp đồng (CONTRACT)', value: 'CONTRACT' },
  { label: 'Tài khoản (ACCOUNT)', value: 'ACCOUNT' },
  { label: 'Kỹ thuật (TECHNICAL)', value: 'TECHNICAL' },
  { label: 'Học tập (ACADEMIC)', value: 'ACADEMIC' },
  { label: 'Khác (OTHER)', value: 'OTHER' }
];

const priorityOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Thấp (LOW)', value: 'LOW' },
  { label: 'Bình thường (MEDIUM)', value: 'MEDIUM' },
  { label: 'Cao (HIGH)', value: 'HIGH' },
  { label: 'Khẩn cấp (URGENT)', value: 'URGENT' }
];

const columns = [
  { name: 'ticketCode', label: 'Mã Ticket', field: 'ticketCode', align: 'left', sortable: true },
  { name: 'title', label: 'Tiêu đề', field: 'title', align: 'left', sortable: true },
  { name: 'category', label: 'Danh mục', field: 'category', align: 'center' },
  { name: 'priority', label: 'Ưu tiên', field: 'priority', align: 'center' },
  { name: 'slaStatus', label: 'SLA (3 Ngày)', field: 'slaStatus', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'OPEN': return 'amber-8';
    case 'IN_PROGRESS': return 'blue-8';
    case 'RESOLVED': return 'positive';
    case 'CLOSED': return 'grey-7';
    default: return 'primary';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Chờ xử lý';
    case 'IN_PROGRESS': return 'Đang xử lý';
    case 'RESOLVED': return 'Đã xử lý';
    case 'CLOSED': return 'Đã đóng';
    default: return status;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'LOW': return 'grey';
    case 'MEDIUM': return 'blue';
    case 'HIGH': return 'orange';
    case 'URGENT': return 'red';
    default: return 'blue';
  }
}

async function loadTickets() {
  loading.value = true;
  try {
    const endpoint = isIntern.value ? '/api/v1/support-tickets/me' : '/api/v1/support-tickets';
    const res = await api.get(endpoint, {
      params: {
        keyword: keyword.value || undefined,
        status: statusFilter.value || undefined,
        category: categoryFilter.value || undefined,
        priority: priorityFilter.value || undefined,
        overdue: overdueFilter.value || undefined
      }
    });
    if (res.data && res.data.data) {
      tickets.value = res.data.data.content || res.data.data;
    }
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách yêu cầu hỗ trợ' });
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  createForm.value = { category: 'CERTIFICATE', priority: 'MEDIUM', title: '', content: '' };
  showCreateDialog.value = true;
}

async function createTicket() {
  saving.value = true;
  try {
    await api.post('/api/v1/support-tickets', createForm.value);
    $q.notify({ type: 'positive', message: 'Gửi yêu cầu hỗ trợ thành công (US-027 / BR-08)' });
    showCreateDialog.value = false;
    await loadTickets();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Gửi yêu cầu thất bại' });
  } finally {
    saving.value = false;
  }
}

async function openDetailDialog(row: any) {
  selectedTicket.value = row;
  showDetailDialog.value = true;
  await loadComments(row.id);
}

async function loadComments(ticketId: number) {
  try {
    const res = await api.get(`/api/v1/support-tickets/${ticketId}/comments`);
    if (res.data && res.data.data) {
      comments.value = res.data.data;
    }
  } catch (err) {
    comments.value = [];
  }
}

async function addComment() {
  if (!newComment.value.trim() || !selectedTicket.value) return;
  commenting.value = true;
  try {
    await api.post(`/api/v1/support-tickets/${selectedTicket.value.id}/comments`, {
      content: newComment.value.trim(),
      isInternal: isInternalNote.value
    });
    newComment.value = '';
    isInternalNote.value = false;
    await loadComments(selectedTicket.value.id);
    $q.notify({ type: 'positive', message: 'Đã thêm phản hồi thành công' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Gửi phản hồi thất bại' });
  } finally {
    commenting.value = false;
  }
}

async function assignTicket(id: number) {
  try {
    await api.post(`/api/v1/support-tickets/${id}/assign`, { assignedToId: authStore.user?.id });
    $q.notify({ type: 'positive', message: 'Đã tiếp nhận phân công xử lý ticket' });
    await loadTickets();
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Tiếp nhận ticket thất bại' });
  }
}

function openResolveDialog(row: any) {
  selectedTicket.value = row;
  resolveText.value = '';
  showResolveDialog.value = true;
}

async function resolveTicket() {
  if (!resolveText.value.trim() || !selectedTicket.value) return;
  resolving.value = true;
  try {
    await api.post(`/api/v1/support-tickets/${selectedTicket.value.id}/resolve`, {
      resolution: resolveText.value.trim()
    });
    $q.notify({ type: 'positive', message: 'Đã giải quyết yêu cầu thành công (RESOLVED)' });
    showResolveDialog.value = false;
    showDetailDialog.value = false;
    await loadTickets();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Thao tác resolve thất bại' });
  } finally {
    resolving.value = false;
  }
}

async function closeTicket(id: number) {
  try {
    await api.post(`/api/v1/support-tickets/${id}/close`);
    $q.notify({ type: 'positive', message: 'Đã hoàn tất đóng yêu cầu hỗ trợ' });
    showDetailDialog.value = false;
    await loadTickets();
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Không thể đóng ticket' });
  }
}

onMounted(() => {
  loadTickets();
});
</script>
