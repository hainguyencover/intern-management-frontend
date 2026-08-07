<template>
  <ListPageLayout
    title="Đánh giá & Hiệu suất Thực tập sinh"
    subtitle="Quản lý quy trình phê duyệt đánh giá kết quả thực tập định kỳ"
  >
    <template #header-actions>
      <BaseButton
        icon="add_chart"
        color="primary"
        label="Tạo phom đánh giá"
        v-can="Permissions.Evaluation.Create"
        @click="openCreateModal"
      />
    </template>

    <template #toolbar>
      <EnterpriseQueryToolbar
        search=""
        placeholder="Tìm kiếm đánh giá..."
        :active-filters="{ status: statusFilter }"
        :active-chips="activeChips"
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
            <q-btn flat round dense icon="thumb_up" color="positive" @click="handleStatusChange(props.row, 'APPROVED')" />
            <q-btn flat round dense icon="thumb_down" color="negative" @click="handleStatusChange(props.row, 'REJECTED')" />
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
      <!-- Create Evaluation Form Dialog -->
      <EvaluationFormDialog
        v-model="showFormDialog"
        v-model:intern-id="formInternId"
        v-model:period="formPeriod"
        v-model:feedback="formFeedback"
        :criteria="criteria"
        :calculated-result="calculatedResult"
        :loading="formLoading"
        :intern-error="internError"
        @save="handleCreateEvaluation"
      />
    </template>
  </ListPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ListPageLayout from '../../../shared/layouts/ListPageLayout.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BasePagination from '../../../shared/components/BasePagination.vue';
import BaseDataTable from '../../../shared/components/BaseDataTable.vue';
import EnterpriseQueryToolbar from '../../../shared/components/filter/EnterpriseQueryToolbar.vue';
import EvaluationFormDialog from '../components/EvaluationFormDialog.vue';
import { Permissions } from '../../../shared/constants/permissions';
import { useEvaluation } from '../composables/useEvaluation';
import type { DataTableColumn } from '../../../shared/components/table/tableTypes';

const {
  items,
  totalPages,
  page,
  statusFilter,
  loading,
  showFormDialog,
  formLoading,
  formInternId,
  formPeriod,
  formFeedback,
  internError,
  criteria,
  calculatedResult,
  openCreateModal,
  handleCreateEvaluation,
  handleStatusChange,
  onPageChange,
  onStatusFilterChange
} = useEvaluation();

const tableColumns: DataTableColumn[] = [
  { name: 'internName', label: 'Tên thực tập sinh', field: 'internName', align: 'left', required: true },
  { name: 'period', label: 'Kỳ đánh giá', field: 'period', align: 'center' },
  { name: 'totalScore', label: 'Tổng điểm', field: 'totalScore', align: 'center' },
  { name: 'status', label: 'Trạng thái phê duyệt', field: 'status', align: 'center' },
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
