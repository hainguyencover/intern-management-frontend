<template>
  <q-chip
    :color="badgeColor"
    text-color="white"
    size="sm"
    dense
    class="text-weight-bold"
  >
    {{ badgeLabel }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MentorStatus } from '../types/mentor';

const props = defineProps<{
  status?: MentorStatus | string;
}>();

const badgeColor = computed(() => {
  switch (props.status) {
    case 'ACTIVE':
      return 'positive';
    case 'INACTIVE':
      return 'grey-7';
    case 'ON_LEAVE':
      return 'warning';
    case 'SUSPENDED':
      return 'negative';
    default:
      return 'primary';
  }
});

const badgeLabel = computed(() => {
  switch (props.status) {
    case 'ACTIVE':
      return 'Đang hoạt động';
    case 'INACTIVE':
      return 'Ngưng hoạt động';
    case 'ON_LEAVE':
      return 'Đang nghỉ phép';
    case 'SUSPENDED':
      return 'Tạm khóa';
    default:
      return props.status || 'ACTIVE';
  }
});
</script>
