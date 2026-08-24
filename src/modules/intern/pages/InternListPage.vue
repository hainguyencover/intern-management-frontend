<template>
  <ListPageLayout
    title="Quản lý Hồ sơ Thực tập sinh"
    subtitle="Quản lý danh sách và hồ sơ thực tập sinh toàn doanh nghiệp (US-001, US-002, US-003, US-047, US-048)"
  >
    <template #header-actions>
      <BaseButton
        icon="person_add"
        color="primary"
        label="Tạo hồ sơ TTS"
        v-can="'intern:create'"
        @click="openCreateModal"
      />
    </template>

    <template #toolbar>
      <div class="column q-gutter-y-sm">
        <div v-if="error" class="q-mb-xs">
          <q-banner dense inline-actions class="bg-negative text-white rounded-borders">
            <template #avatar>
              <q-icon name="warning" color="white" />
            </template>
            {{ error }}
          </q-banner>
        </div>

        <!-- Clean, Single-Row Search & Filter Bar -->
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-5">
            <q-input
              dense
              outlined
              v-model="searchInput"
              placeholder="Tìm kiếm theo mã, họ tên, email..."
              clearable
              @update:model-value="onSearchChange"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-2">
            <q-input
              dense
              outlined
              v-model="univInput"
              placeholder="Trường Đại học"
              clearable
              @update:model-value="onUniversityFilterChange($event || '')"
            >
              <template #prepend>
                <q-icon name="school" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-2">
            <q-input
              dense
              outlined
              v-model="majorInput"
              placeholder="Chuyên ngành"
              clearable
              @update:model-value="onMajorFilterChange($event || '')"
            >
              <template #prepend>
                <q-icon name="auto_stories" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 col-md-3">
            <q-select
              dense
              outlined
              v-model="statusSelect"
              :options="statusOptions"
              emit-value
              map-options
              clearable
              placeholder="Trạng thái"
              @update:model-value="onStatusFilterChange($event || '')"
            >
              <template #prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="!loading && (!items || items.length === 0)" class="flex flex-center q-pa-xl text-center">
        <div>
          <q-icon name="search_off" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">Không tìm thấy thực tập sinh phù hợp</div>
          <div class="text-body2 text-grey-6 q-mb-md">
            Thử thay đổi bộ lọc trường/ngành hoặc từ khóa tìm kiếm.
          </div>
          <q-btn color="primary" outline label="Đặt lại bộ lọc" @click="handleResetFilters" />
        </div>
      </div>

      <BaseDataTable
        v-else
        :rows="items || []"
        :columns="tableColumns"
        :loading="loading"
        :pagination="tablePagination"
        selectable
        @request="onRequest"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="getStatusChipColor(props.value)"
              text-color="white"
              size="sm"
            >
              {{ props.value || 'DRAFT' }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-xs">
            <q-btn flat round dense icon="visibility" color="teal" title="Xem chi tiết (US-047)" @click="openDetailModal(props.row)" />
            <q-btn flat round dense icon="edit" color="primary" title="Chỉnh sửa (US-002)" @click="openEditModal(props.row)" />
            <q-btn flat round dense icon="manage_history" color="amber-10" title="Lịch sử thay đổi hồ sơ (US-048)" @click="openProfileHistoryModal(props.row)" />
            <q-btn flat round dense icon="assignment" color="secondary" title="Phân công Mentor" @click="openAssignModal(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" title="Xóa hồ sơ" @click="openDeleteModal(props.row)" />
          </q-td>
        </template>
      </BaseDataTable>
    </template>

    <template #pagination>
      <BasePagination
        :model-value="page"
        :max="totalPages"
        @update:model-value="onPageChange"
      />
    </template>

    <template #drawer>
      <!-- Detail View Modal (US-047) -->
      <InternDetailDialog
        v-model="showDetailDialog"
        :intern="selectedDetailIntern"
        @edit="handleDetailEdit"
      />

      <!-- Profile Change History Dialog (US-048) -->
      <InternHistoryDialog
        v-model="showProfileHistoryDialog"
        :intern-name="selectedDetailIntern?.fullName || ''"
        :history="profileHistory"
        :loading="historyLoading"
      />

      <!-- Create / Edit Modal -->
      <InternFormDialog
        v-model="showFormDialog"
        :is-edit="!!activeIntern"
        v-model:full-name="formFullName"
        v-model:email="formEmail"
        v-model:phone="formPhone"
        v-model:university="formUniversity"
        v-model:major="formMajor"
        v-model:gpa="formGpa"
        v-model:status="formStatus"
        v-model:start-date="formStartDate"
        v-model:end-date="formEndDate"
        :loading="formLoading"
        :name-error="nameError"
        :email-error="emailError"
        :phone-error="phoneError"
        @save="handleSave"
      />

      <!-- Delete Confirmation Modal -->
      <BaseDialog
        v-model="showDeleteDialog"
        title="Xác nhận xóa hồ sơ"
        :loading="formLoading"
        @cancel="showDeleteDialog = false"
      >
        <div>
          Bạn có chắc chắn muốn xóa hồ sơ thực tập sinh
          <strong class="text-primary">{{ activeIntern?.fullName }}</strong> ({{ activeIntern?.studentCode || activeIntern?.internCode }})?
          Thao tác này không thể hoàn tác.
        </div>
        <template #actions>
          <BaseButton flat label="Hủy" color="secondary" @click="showDeleteDialog = false" />
          <BaseButton label="Xác nhận xóa" color="negative" :loading="formLoading" @click="handleDeleteConfirm" />
        </template>
      </BaseDialog>

      <!-- Assignment Modal -->
      <AssignmentModal
        v-model="showAssignDialog"
        :intern-name="selectedIntern?.fullName || ''"
        v-model:mentor-id="formMentorId"
        v-model:department-id="formDepartmentId"
        v-model:start-date="formAssignStartDate"
        v-model:end-date="formAssignEndDate"
        :capacity-info="capacityInfo"
        :loading="assignLoading"
        :mentor-error="mentorError"
        :department-error="departmentError"
        :general-error="generalError"
        @save="handleAssignSubmit"
      />

      <!-- Assignment History Dialog -->
      <AssignmentHistoryDialog
        v-model="showHistoryDialog"
        :intern-name="selectedIntern?.fullName || ''"
        :history="history"
      />
    </template>
  </ListPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ListPageLayout from '../../../shared/layouts/ListPageLayout.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BasePagination from '../../../shared/components/BasePagination.vue';
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseDataTable from '../../../shared/components/BaseDataTable.vue';
import EnterpriseQueryToolbar from '../../../shared/components/filter/EnterpriseQueryToolbar.vue';
import InternFormDialog from '../components/InternFormDialog.vue';
import InternDetailDialog from '../components/InternDetailDialog.vue';
import InternHistoryDialog from '../components/InternHistoryDialog.vue';
import AssignmentModal from '../components/AssignmentModal.vue';
import AssignmentHistoryDialog from '../components/AssignmentHistoryDialog.vue';
import { useIntern } from '../composables/useIntern';
import { useAssignment } from '../composables/useAssignment';
import { fetchInternHistory } from '../services/internService';
import type { DataTableColumn } from '../../../shared/components/table/tableTypes';
import type { InternProfile } from '../models/intern';

const {
  items,
  totalElements,
  totalPages,
  page,
  limit,
  search,
  statusFilter,
  universityFilter,
  majorFilter,
  loading,
  error,
  activeIntern,
  showFormDialog,
  showDeleteDialog,
  formLoading,
  formFullName,
  formEmail,
  formPhone,
  formUniversity,
  formMajor,
  formGpa,
  formStatus,
  formStartDate,
  formEndDate,
  nameError,
  emailError,
  phoneError,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  handleSave,
  handleDeleteConfirm,
  onSearch,
  onPageChange,
  onLimitChange,
  onStatusFilterChange,
  onUniversityFilterChange,
  onMajorFilterChange,
  onClearAllFilters
} = useIntern();

const tablePagination = computed(() => ({
  page: page.value,
  rowsPerPage: limit.value,
  rowsNumber: totalElements.value
}));

function onRequest(requestProps: any) {
  const { page: newPage, rowsPerPage: newLimit } = requestProps.pagination;
  if (newLimit !== limit.value) {
    onLimitChange(newLimit);
  } else if (newPage !== page.value) {
    onPageChange(newPage);
  }
}

const {
  showAssignDialog,
  showHistoryDialog,
  formLoading: assignLoading,
  selectedIntern,
  history,
  capacityInfo,
  formMentorId,
  formDepartmentId,
  formStartDate: formAssignStartDate,
  formEndDate: formAssignEndDate,
  mentorError,
  departmentError,
  generalError,
  openAssignModal,
  openHistoryModal,
  handleAssignSubmit
} = useAssignment();

const showDetailDialog = ref(false);
const selectedDetailIntern = ref<InternProfile | null>(null);
const showProfileHistoryDialog = ref(false);
const profileHistory = ref<any[]>([]);
const historyLoading = ref(false);

function openDetailModal(intern: InternProfile) {
  selectedDetailIntern.value = intern;
  showDetailDialog.value = true;
}

async function openProfileHistoryModal(intern: InternProfile) {
  selectedDetailIntern.value = intern;
  showProfileHistoryDialog.value = true;
  historyLoading.value = true;
  try {
    profileHistory.value = await fetchInternHistory(intern.id);
  } finally {
    historyLoading.value = false;
  }
}

function handleDetailEdit(intern: InternProfile | null) {
  showDetailDialog.value = false;
  if (intern) {
    openEditModal(intern);
  }
}

const searchInput = ref(search.value);
const univInput = ref(universityFilter.value);
const majorInput = ref(majorFilter.value);
const statusSelect = ref(statusFilter.value);

watch(search, (val) => { searchInput.value = val; });
watch(universityFilter, (val) => { univInput.value = val; });
watch(majorFilter, (val) => { majorInput.value = val; });
watch(statusFilter, (val) => { statusSelect.value = val; });

let searchTimer: any = null;
function onSearchChange(val: string | null) {
  const cleanVal = val || '';
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    onSearch(cleanVal);
  }, 300);
}

const statusOptions = [
  { label: 'Tất cả trạng thái', value: '' },
  { label: 'Bản nháp (DRAFT)', value: 'DRAFT' },
  { label: 'Đã nộp (SUBMITTED)', value: 'SUBMITTED' },
  { label: 'Đang xét duyệt (REVIEWING)', value: 'REVIEWING' },
  { label: 'Đã duyệt (APPROVED)', value: 'APPROVED' },
  { label: 'Đang thực tập (INTERNING)', value: 'INTERNING' },
  { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' },
  { label: 'Từ chối (REJECTED)', value: 'REJECTED' }
];

const tableColumns: DataTableColumn[] = [
  { name: 'studentCode', label: 'Mã TTS', field: (row: any) => row.studentCode || row.internCode || '—', align: 'left', required: true, sortable: true },
  { name: 'fullName', label: 'Họ tên', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'university', label: 'Trường Đại học', field: 'university', align: 'left', sortable: true },
  { name: 'major', label: 'Chuyên ngành', field: 'major', align: 'left', sortable: true },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Thao tác', field: '', align: 'center', required: true }
];

const activeChips = computed(() => {
  const chips = [];
  if (statusFilter.value) {
    chips.push({ key: 'status', label: 'Trạng thái', displayValue: statusFilter.value });
  }
  if (universityFilter.value) {
    chips.push({ key: 'university', label: 'Trường', displayValue: universityFilter.value });
  }
  if (majorFilter.value) {
    chips.push({ key: 'major', label: 'Ngành', displayValue: majorFilter.value });
  }
  return chips;
});

function getStatusChipColor(status: string) {
  switch (status) {
    case 'APPROVED': return 'positive';
    case 'INTERNING': return 'teal';
    case 'SUBMITTED': return 'info';
    case 'REVIEWING': return 'purple';
    case 'COMPLETED': return 'deep-purple';
    case 'REJECTED': return 'negative';
    default: return 'grey-7';
  }
}

function onRemoveFilter(key: string) {
  if (key === 'status') onStatusFilterChange('');
  if (key === 'university') onUniversityFilterChange('');
  if (key === 'major') onMajorFilterChange('');
}

function handleResetFilters() {
  univInput.value = '';
  majorInput.value = '';
  statusSelect.value = '';
  onClearAllFilters();
}
</script>
