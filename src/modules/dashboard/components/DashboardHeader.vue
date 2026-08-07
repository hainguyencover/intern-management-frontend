<template>
  <div class="row items-center justify-between q-mb-lg">
    <div>
      <h5 class="q-my-none text-bold text-primary">Tổng quan hệ thống</h5>
      <div class="text-subtitle2 text-grey-6 q-mt-xs">
        Báo cáo chỉ số KPI và hoạt động thực tập sinh theo thời gian thực
      </div>
    </div>

    <div class="row q-gutter-sm items-center">
      <BaseSelect
        :model-value="timeRange"
        :options="periodOptions"
        style="width: 160px"
        @update:model-value="(val) => $emit('update:timeRange', val)"
      />
      <BaseButton
        icon="refresh"
        color="primary"
        label="Làm mới"
        :loading="loading"
        @click="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  timeRange: 'week' | 'month' | 'quarter';
  loading?: boolean;
}>();

defineEmits<{
  (e: 'update:timeRange', value: 'week' | 'month' | 'quarter'): void;
  (e: 'refresh'): void;
}>();

const periodOptions = [
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Quý này', value: 'quarter' }
];
</script>
