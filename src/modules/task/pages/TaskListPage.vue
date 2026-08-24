<template>
  <ListPageLayout
    title="Nhiệm vụ & Báo cáo hằng ngày"
    subtitle="Theo dõi tiến độ giao việc và duyệt nhật ký làm việc thực tập sinh"
  >
    <template #header-actions>
      <BaseButton
        v-if="isIntern"
        icon="event_note"
        color="secondary"
        label="Nộp báo cáo ngày"
        @click="openDailyReportModal"
      />
      <BaseButton
        v-if="isStaff"
        icon="add_task"
        color="primary"
        label="Giao nhiệm vụ"
        @click="openCreateTaskModal"
      />

    </template>

    <template #toolbar>
      <EnterpriseQueryToolbar
        :search="search"
        :active-filters="{ status: statusFilter }"
        :active-chips="activeChips"
        placeholder="Tìm kiếm theo mã hoặc tiêu đề nhiệm vụ..."
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
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="getTaskStatusColor(props.value)"
              text-color="white"
              size="sm"
            >
              {{ props.value || 'OPEN' }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-xs">
            <q-btn flat round dense icon="visibility" color="primary" @click="openTaskDetail(props.row)" />
            <q-btn v-if="isStaff && props.row.status !== 'DONE'" flat round dense icon="check_circle" color="positive" @click="handleStatusChange(props.row, 'DONE')" />
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
      <!-- Create Task Modal -->
      <TaskFormDialog
        v-model="showTaskDialog"
        v-model:title="formTitle"
        v-model:description="formDescription"
        v-model:assignee-id="formAssigneeId"
        v-model:due-date="formDueDate"
        v-model:priority="formPriority"
        :loading="formLoading"
        :title-error="titleError"
        :desc-error="descError"
        @save="handleCreateTask"
      />

      <!-- Task Detail Drawer -->
      <TaskDetailDrawer
        v-model="showDetailDrawer"
        :task="activeTask"
        :comments="activeComments"
        v-model:new-comment-text="newCommentText"
        @add-comment="handleAddComment"
      />

      <!-- Daily Report Modal -->
      <DailyReportModal
        v-model="showReportDialog"
        v-model:report-date="formReportDate"
        v-model:content="formReportContent"
        :loading="formLoading"
        :content-error="reportError"
        @save="handleSubmitDailyReport"
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
import TaskFormDialog from '../components/TaskFormDialog.vue';
import TaskDetailDrawer from '../components/TaskDetailDrawer.vue';
import DailyReportModal from '../components/DailyReportModal.vue';
import { useTask } from '../composables/useTask';
import type { DataTableColumn } from '../../../shared/components/table/tableTypes';
import { usePermission } from '../../../shared/composables/usePermission';

const { hasRole } = usePermission();
const isIntern = computed(() => hasRole('INTERN'));
const isStaff = computed(() => hasRole('HR') || hasRole('ADMIN') || hasRole('MENTOR'));

const {
  items,
  totalPages,
  page,
  search,
  statusFilter,
  loading,
  activeTask,
  activeComments,
  showTaskDialog,
  showDetailDrawer,
  showReportDialog,
  formLoading,
  formTitle,
  formDescription,
  formAssigneeId,
  formDueDate,
  formPriority,
  titleError,
  descError,
  newCommentText,
  formReportDate,
  formReportContent,
  reportError,
  openCreateTaskModal,
  openTaskDetail,
  openDailyReportModal,
  handleCreateTask,
  handleStatusChange,
  handleAddComment,
  handleSubmitDailyReport,
  onSearch,
  onPageChange,
  onStatusFilterChange
} = useTask();

const tableColumns: DataTableColumn[] = [
  { name: 'taskCode', label: 'Mã nhiệm vụ', field: 'taskCode', align: 'left', required: true },
  { name: 'title', label: 'Tiêu đề', field: 'title', align: 'left' },
  { name: 'priority', label: 'Mức độ ưu tiên', field: 'priority', align: 'center' },
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

function getTaskStatusColor(status: string) {
  switch (status) {
    case 'DONE':
    case 'COMPLETED': return 'positive';
    case 'IN_PROGRESS': return 'cyan-8';
    case 'CANCELLED': return 'grey';
    default: return 'primary';
  }
}

function onRemoveFilter(key: string) {
  if (key === 'status') {
    onStatusFilterChange('');
  }
}

function onClearFilters() {
  onStatusFilterChange('');
}
</script>
