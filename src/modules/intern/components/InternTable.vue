<template>
  <BaseTable
    :rows="items"
    :columns="columns"
    :loading="loading"
    row-key="id"
  >
    <!-- Avatar & Full Name slot -->
    <template #body-cell-fullName="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <BaseAvatar :src="props.row.avatarUrl" icon="person" size="md" class="q-mr-sm" />
          <div>
            <div class="text-bold">{{ props.row.fullName }}</div>
            <div class="text-caption text-grey-6">{{ props.row.email }}</div>
          </div>
        </div>
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

    <!-- Action Buttons slot -->
    <template #body-cell-actions="props">
      <q-td :props="props" class="q-gutter-x-xs text-right">
        <BaseButton
          icon="assignment_ind"
          color="secondary"
          v-can="'intern:assign'"
          @click="$emit('assign', props.row)"
        />
        <BaseButton
          icon="history"
          color="info"
          @click="$emit('history', props.row)"
        />
        <BaseButton
          icon="edit"
          color="primary"
          v-can="'intern:update'"
          @click="$emit('edit', props.row)"
        />
        <BaseButton
          icon="delete"
          color="negative"
          v-can="'intern:delete'"
          @click="$emit('delete', props.row)"
        />
      </q-td>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../../../shared/components/BaseTable.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import BaseAvatar from '../../../shared/components/BaseAvatar.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import type { InternProfile } from '../models/intern';

defineProps<{
  items: InternProfile[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'edit', item: InternProfile): void;
  (e: 'delete', item: InternProfile): void;
  (e: 'assign', item: InternProfile): void;
  (e: 'history', item: InternProfile): void;
}>();

const columns = [
  { name: 'internCode', label: 'Mã TTS', field: 'internCode', align: 'left' as const, sortable: true },
  { name: 'fullName', label: 'Họ tên & Email', field: 'fullName', align: 'left' as const, sortable: true },
  { name: 'university', label: 'Trường ĐH & Chuyên ngành', field: (row: InternProfile) => `${row.university} - ${row.major}`, align: 'left' as const },
  { name: 'phone', label: 'Số điện thoại', field: 'phone', align: 'center' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' as const }
];

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    APPLIED: 'Ứng tuyển',
    INTERNING: 'Đang thực tập',
    COMPLETED: 'Tốt nghiệp',
    TERMINATED: 'Đã nghỉ'
  };
  return map[status] || status;
}

function getStatusColor(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
    APPLIED: 'info',
    INTERNING: 'success',
    COMPLETED: 'primary',
    TERMINATED: 'danger'
  };
  return map[status] || 'secondary';
}
</script>
