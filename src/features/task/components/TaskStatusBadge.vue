<template>
  <q-badge :color="statusColor" :label="statusLabel" class="text-weight-medium q-px-sm q-py-xs" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  overdue: {
    type: Boolean,
    default: false
  }
});

const statusColor = computed(() => {
  if (props.overdue && props.status !== 'APPROVED' && props.status !== 'DONE') {
    return 'negative';
  }
  switch (props.status) {
    case 'OPEN':
    case 'TODO':
      return 'blue-6';
    case 'IN_PROGRESS':
      return 'warning';
    case 'SUBMITTED':
      return 'purple-6';
    case 'APPROVED':
    case 'DONE':
      return 'positive';
    case 'NEEDS_CHANGES':
      return 'deep-orange-6';
    case 'CANCELLED':
      return 'grey-7';
    default:
      return 'grey-6';
  }
});

const statusLabel = computed(() => {
  if (props.overdue && props.status !== 'APPROVED' && props.status !== 'DONE') {
    return 'Quá hạn';
  }
  switch (props.status) {
    case 'OPEN':
    case 'TODO':
      return 'Chưa làm';
    case 'IN_PROGRESS':
      return 'Đang làm';
    case 'SUBMITTED':
      return 'Đã nộp';
    case 'APPROVED':
    case 'DONE':
      return 'Hoàn thành';
    case 'NEEDS_CHANGES':
      return 'Cần chỉnh sửa';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return props.status || 'Chưa xác định';
  }
});
</script>
