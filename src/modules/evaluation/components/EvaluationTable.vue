<template>
  <BaseTable
    :rows="items"
    :columns="columns"
    :loading="loading"
    row-key="id"
  >
    <!-- Weighted Score slot -->
    <template #body-cell-weightedScore="props">
      <q-td :props="props">
        <span class="text-bold text-primary">{{ props.row.weightedScore }} / 10</span>
      </q-td>
    </template>

    <!-- Grade & Pass/Fail slot -->
    <template #body-cell-grade="props">
      <q-td :props="props" class="q-gutter-x-xs">
        <BaseBadge
          :label="`Grade ${props.row.grade}`"
          :color="getGradeColor(props.row.grade)"
        />
        <BaseBadge
          :label="props.row.passFail"
          :color="props.row.passFail === 'PASS' ? 'success' : 'danger'"
        />
      </q-td>
    </template>

    <!-- Status slot -->
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
          v-if="props.row.status === 'DRAFT'"
          icon="send"
          color="primary"
          label="Gửi duyệt"
          @click="$emit('changeStatus', props.row, 'SUBMITTED')"
        />
        <BaseButton
          v-if="props.row.status === 'SUBMITTED'"
          icon="fact_check"
          color="warning"
          label="Bắt đầu duyệt"
          v-can="Permissions.Evaluation.Review"
          @click="$emit('changeStatus', props.row, 'UNDER_REVIEW')"
        />
        <BaseButton
          v-if="props.row.status === 'UNDER_REVIEW'"
          icon="check_circle"
          color="success"
          label="Phê duyệt (PASS)"
          v-can="Permissions.Evaluation.Approve"
          @click="$emit('changeStatus', props.row, 'APPROVED')"
        />
        <BaseButton
          v-if="props.row.status === 'UNDER_REVIEW'"
          icon="cancel"
          color="negative"
          label="Từ chối"
          v-can="Permissions.Evaluation.Approve"
          @click="$emit('changeStatus', props.row, 'REJECTED')"
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
import type { Evaluation, EvaluationStatus } from '../models/evaluation';

defineProps<{
  items: Evaluation[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'changeStatus', item: Evaluation, targetStatus: EvaluationStatus): void;
}>();

const columns = [
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left' as const, sortable: true },
  { name: 'mentorName', label: 'Mentor đánh giá', field: 'mentorName', align: 'left' as const },
  { name: 'period', label: 'Kỳ đánh giá', field: 'period', align: 'center' as const },
  { name: 'weightedScore', label: 'Điểm trọng số', field: 'weightedScore', align: 'center' as const, sortable: true },
  { name: 'grade', label: 'Xếp loại', field: 'grade', align: 'center' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const },
  { name: 'createdAt', label: 'Ngày tạo', field: 'createdAt', align: 'center' as const },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' as const }
];

function getStatusLabel(status: EvaluationStatus): string {
  const map: Record<EvaluationStatus, string> = {
    DRAFT: 'Bản thảo',
    SUBMITTED: 'Đã nộp',
    UNDER_REVIEW: 'Đang xem xét',
    APPROVED: 'Đã phê duyệt',
    REJECTED: 'Bị từ chối'
  };
  return map[status] || status;
}

function getStatusColor(status: EvaluationStatus): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<EvaluationStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
    DRAFT: 'secondary',
    SUBMITTED: 'info',
    UNDER_REVIEW: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger'
  };
  return map[status] || 'secondary';
}

function getGradeColor(grade: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  if (grade === 'A') return 'success';
  if (grade === 'B') return 'primary';
  if (grade === 'C') return 'info';
  if (grade === 'D') return 'warning';
  return 'danger';
}
</script>
