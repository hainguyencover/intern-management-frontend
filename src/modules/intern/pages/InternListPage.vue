<template>
  <ListPageLayout
    title="Quản lý Thực tập sinh"
    subtitle="Quản lý danh sách và hồ sơ thực tập sinh toàn doanh nghiệp"
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
      <EnterpriseQueryToolbar
        :search="search"
        :active-filters="{ status: statusFilter }"
        :active-chips="activeChips"
        placeholder="Tìm kiếm theo mã, họ tên hoặc trường ĐH..."
        @update:search="onSearch"
        @search="onSearch"
        @removeFilter="onRemoveFilter"
        @clearFilters="onClearFilters"
      />
    </template>

    <template #content>
      <BaseDataTable
        :rows="items"
        :columns="tableColumns"
        :loading="loading"
        selectable
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-xs">
            <q-btn flat round dense icon="edit" color="primary" @click="openEditModal(props.row)" />
            <q-btn flat round dense icon="assignment" color="secondary" @click="openAssignModal(props.row)" />
            <q-btn flat round dense icon="history" color="info" @click="openHistoryModal(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" @click="openDeleteModal(props.row)" />
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
          <strong class="text-primary">{{ activeIntern?.fullName }}</strong> ({{ activeIntern?.internCode }})?
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
import { computed } from 'vue';
import ListPageLayout from '../../../shared/layouts/ListPageLayout.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BasePagination from '../../../shared/components/BasePagination.vue';
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseDataTable from '../../../shared/components/BaseDataTable.vue';
import EnterpriseQueryToolbar from '../../../shared/components/filter/EnterpriseQueryToolbar.vue';
import InternFormDialog from '../components/InternFormDialog.vue';
import AssignmentModal from '../components/AssignmentModal.vue';
import AssignmentHistoryDialog from '../components/AssignmentHistoryDialog.vue';
import { useIntern } from '../composables/useIntern';
import { useAssignment } from '../composables/useAssignment';
import type { DataTableColumn } from '../../../shared/components/table/tableTypes';

const {
  items,
  totalPages,
  page,
  search,
  statusFilter,
  loading,
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
  onStatusFilterChange
} = useIntern();

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

const tableColumns: DataTableColumn[] = [
  { name: 'internCode', label: 'Mã TTS', field: 'internCode', align: 'left', required: true },
  { name: 'fullName', label: 'Họ tên', field: 'fullName', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'university', label: 'Trường Đại học', field: 'university', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: '', align: 'center', required: true }
];

const activeChips = computed(() => {
  const chips = [];
  if (statusFilter.value) {
    chips.push({ key: 'status', label: 'Trạng thái', displayValue: statusFilter.value });
  }
  return chips;
});

function onRemoveFilter(key: string) {
  if (key === 'status') {
    onStatusFilterChange('');
  }
}

function onClearFilters() {
  onStatusFilterChange('');
}
</script>
