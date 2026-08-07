<template>
  <ListPageLayout
    title="Danh sách Phòng ban"
    subtitle="Quản lý cơ cấu sơ đồ tổ chức phòng ban doanh nghiệp"
  >
    <template #header-actions>
      <BaseButton
        icon="add"
        color="primary"
        label="Thêm phòng ban"
        v-can="'dept:create'"
        @click="openCreateModal"
      />
    </template>

    <template #toolbar>
      <EnterpriseQueryToolbar
        :search="search"
        :active-filters="{ status: statusFilter }"
        :active-chips="activeChips"
        placeholder="Tìm kiếm theo mã hoặc tên phòng ban..."
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
            <q-btn flat round dense icon="delete" color="negative" @click="openDeleteModal(props.row)" />
          </q-td>
        </template>
      </BaseDataTable>
    </template>

    <template #pagination>
      <BasePagination
        :model-value="page"
        :max="Math.ceil(total / limit) || 1"
        @update:model-value="onPageChange"
      />
    </template>

    <!-- Create / Edit Modal -->
    <template #drawer>
      <DepartmentFormDialog
        v-model="showFormDialog"
        :is-edit="!!activeItem"
        v-model:code="formCode"
        v-model:name="formName"
        v-model:description="formDescription"
        v-model:status="formStatus"
        :loading="formLoading"
        :code-error="codeError"
        :nameError="nameError"
        @save="handleSave"
      />

      <!-- Delete Confirmation Modal -->
      <BaseDialog
        v-model="showDeleteDialog"
        title="Xác nhận xóa phòng ban"
        :loading="formLoading"
        @cancel="showDeleteDialog = false"
      >
        <div>
          Bạn có chắc chắn muốn xóa phòng ban
          <strong class="text-primary">{{ activeItem?.name }}</strong> ({{ activeItem?.code }})?
          Thao tác này không thể hoàn tác.
        </div>
        <template #actions>
          <BaseButton flat label="Hủy" color="secondary" @click="showDeleteDialog = false" />
          <BaseButton label="Xác nhận xóa" color="negative" :loading="formLoading" @click="handleDeleteConfirm" />
        </template>
      </BaseDialog>
    </template>
  </ListPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ListPageLayout from '../../../shared/layouts/ListPageLayout.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BasePagination from '../../../shared/components/BasePagination.vue';
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseDataTable from '../../../shared/components/BaseDataTable.vue';
import EnterpriseQueryToolbar from '../../../shared/components/filter/EnterpriseQueryToolbar.vue';
import DepartmentFormDialog from '../components/DepartmentFormDialog.vue';
import { useDepartment } from '../composables/useDepartment';
import type { DataTableColumn } from '../../../shared/components/table/tableTypes';

const {
  items,
  total,
  page,
  limit,
  search,
  statusFilter,
  loading,
  activeItem,
  showFormDialog,
  showDeleteDialog,
  formLoading,
  formCode,
  formName,
  formDescription,
  formStatus,
  codeError,
  nameError,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  handleSave,
  handleDeleteConfirm,
  onSearch,
  onPageChange,
  onStatusFilterChange
} = useDepartment();

const tableColumns: DataTableColumn[] = [
  { name: 'code', label: 'Mã phòng ban', field: 'code', align: 'left', required: true },
  { name: 'name', label: 'Tên phòng ban', field: 'name', align: 'left' },
  { name: 'description', label: 'Mô tả', field: 'description', align: 'left' },
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
