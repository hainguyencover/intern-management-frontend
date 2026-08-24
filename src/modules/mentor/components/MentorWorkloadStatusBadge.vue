<template>
  <q-chip
    :color="badgeColor"
    text-color="white"
    size="sm"
    dense
    class="text-weight-bold q-px-sm"
  >
    <q-icon :name="badgeIcon" size="14px" class="q-mr-xs" />
    {{ badgeLabel }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MentorWorkloadStatus } from '../types/mentorWorkload';

const props = defineProps<{
  status?: MentorWorkloadStatus | string;
}>();

const badgeColor = computed(() => {
  switch (props.status) {
    case 'NO_ASSIGNMENT':
      return 'grey-7';
    case 'UNDERLOAD':
      return 'blue-7';
    case 'NORMAL':
      return 'positive';
    case 'NEAR_CAPACITY':
      return 'warning';
    case 'OVERLOAD':
      return 'negative';
    default:
      return 'primary';
  }
});

const badgeIcon = computed(() => {
  switch (props.status) {
    case 'NO_ASSIGNMENT':
      return 'pause_circle_outline';
    case 'UNDERLOAD':
      return 'trending_down';
    case 'NORMAL':
      return 'check_circle';
    case 'NEAR_CAPACITY':
      return 'warning';
    case 'OVERLOAD':
      return 'error';
    default:
      return 'help_outline';
  }
});

const badgeLabel = computed(() => {
  switch (props.status) {
    case 'NO_ASSIGNMENT':
      return 'Chưa phân công';
    case 'UNDERLOAD':
      return 'Thiếu tải';
    case 'NORMAL':
      return 'Bình thường';
    case 'NEAR_CAPACITY':
      return 'Gần đầy tải';
    case 'OVERLOAD':
      return 'Quá tải';
    default:
      return props.status || 'N/A';
  }
});
</script>
