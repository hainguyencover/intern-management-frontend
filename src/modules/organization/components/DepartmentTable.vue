<template>
  <BaseTable
    :rows="items"
    :columns="columns"
    :loading="loading"
    row-key="id"
  >
    <!-- Slot custom cho cột trạng thái -->
    <template #body-cell-status="props">
      <q-td :props="props">
        <BaseBadge
          :label="props.row.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'"
          :color="props.row.status === 'ACTIVE' ? 'success' : 'secondary'"
        />
      </q-td>
    </template>

    <!-- Slot custom cho cột hành động -->
    <template #body-cell-actions="props">
      <q-td :props="props" class="q-gutter-x-xs text-right">
        <BaseButton
          icon="edit"
          color="primary"
          v-can="'dept:update'"
          @click="$emit('edit', props.row)"
        />
        <BaseButton
          icon="delete"
          color="negative"
          v-can="'dept:delete'"
          @click="$emit('delete', props.row)"
        />
      </q-td>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../../../shared/components/BaseTable.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import type { Department } from '../models/department';

defineProps<{
  items: Department[];
  loading?: boolean;
}>();

defineEmits<{
  (e: 'edit', item: Department): void;
  (e: 'delete', item: Department): void;
}>();

const columns = [
  { name: 'code', label: 'Mã phòng ban', field: 'code', align: 'left' as const, sortable: true },
  { name: 'name', label: 'Tên phòng ban', field: 'name', align: 'left' as const, sortable: true },
  { name: 'internCount', label: 'Số lượng thực tập sinh', field: 'internCount', align: 'center' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const },
  { name: 'createdAt', label: 'Ngày tạo', field: 'createdAt', align: 'center' as const },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' as const }
];
</script>
