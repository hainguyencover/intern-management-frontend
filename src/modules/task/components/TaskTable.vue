<template>
  <BaseTable
    :rows="items"
    :columns="columns"
    :loading="loading"
    row-key="id"
  >
    <!-- Task Code & Title slot -->
    <template #body-cell-code="props">
      <q-td :props="props">
        <span class="text-bold text-primary">{{ props.row.code }}</span>
      </q-td>
    </template>

    <!-- Priority Badge slot -->
    <template #body-cell-priority="props">
      <q-td :props="props">
        <BaseBadge
          :label="props.row.priority"
          :color="getPriorityColor(props.row.priority)"
        />
      </q-td>
    </template>

    <!-- Status Badge slot -->
    <template #body-cell-status="props">
      <q-td :props="props">
        <BaseBadge
          :label="getStatusLabel(props.row.status)"
          :color="getStatusColor(props.row.status)"
        />
      </q-td>
    </template>

    <!-- Actions slot -->
    <template #body-cell-actions="props">
      <q-td :props="props" class="q-gutter-x-xs text-right">
        <BaseButton
          icon="visibility"
          color="info"
          label="Chi tiết"
          @click="$emit('view', props.row)"
        />
        <BaseButton
          v-if="props.row.status === 'TODO'"
          icon="play_arrow"
          color="primary"
          label="Bắt đầu"
          @click="$emit('changeStatus', props.row, 'IN_PROGRESS')"
        />
        <BaseButton
          v-if="props.row.status === 'IN_PROGRESS'"
          icon="rate_review"
          color="warning"
          label="Gửi duyệt"
          @click="$emit('changeStatus', props.row, 'REVIEW')"
        />
        <BaseButton
          v-if="props.row.status === 'REVIEW'"
          icon="task_alt"
          color="success"
          label="Duyệt DONE"
          v-can="Permissions.Task.Review"
          @click="$emit('changeStatus', props.row, 'DONE')"
        />
      </q-td>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../../../shared/components/BaseTable.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { Permissions } from '../../../shared/constants/permissions';
import type { Task, TaskStatus } from '../models/task';

defineProps<{
  items: Task[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'view', task: Task): void;
  (e: 'changeStatus', task: Task, targetStatus: TaskStatus): void;
}>();

const columns = [
  { name: 'code', label: 'Mã Task', field: 'code', align: 'left' as const, sortable: true },
  { name: 'title', label: 'Tên nhiệm vụ', field: 'title', align: 'left' as const, sortable: true },
  { name: 'assigneeName', label: 'Thực tập sinh', field: 'assigneeName', align: 'left' as const },
  { name: 'priority', label: 'Mức ưu tiên', field: 'priority', align: 'center' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const },
  { name: 'dueDate', label: 'Hạn hoàn thành', field: 'dueDate', align: 'center' as const },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' as const }
];

function getStatusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    TODO: 'Cần làm',
    IN_PROGRESS: 'Đang làm',
    REVIEW: 'Chờ duyệt',
    DONE: 'Hoàn thành',
    REOPENED: 'Mở lại'
  };
  return map[status] || status;
}

function getStatusColor(status: TaskStatus): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<TaskStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
    TODO: 'secondary',
    IN_PROGRESS: 'primary',
    REVIEW: 'warning',
    DONE: 'success',
    REOPENED: 'danger'
  };
  return map[status] || 'secondary';
}

function getPriorityColor(priority: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  if (priority === 'URGENT') return 'danger';
  if (priority === 'HIGH') return 'warning';
  if (priority === 'MEDIUM') return 'info';
  return 'secondary';
}
</script>
