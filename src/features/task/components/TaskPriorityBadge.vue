<template>
  <q-chip dense :color="badgeColor" text-color="white" :icon="badgeIcon" class="text-caption">
    {{ label }}
  </q-chip>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  priority: {
    type: String,
    default: 'MEDIUM'
  }
});

const badgeColor = computed(() => {
  switch (props.priority) {
    case 'LOW': return 'grey-7';
    case 'MEDIUM': return 'info';
    case 'HIGH': return 'orange-8';
    case 'URGENT': return 'red-8';
    default: return 'primary';
  }
});

const badgeIcon = computed(() => {
  switch (props.priority) {
    case 'LOW': return 'arrow_downward';
    case 'MEDIUM': return 'remove';
    case 'HIGH': return 'arrow_upward';
    case 'URGENT': return 'priority_high';
    default: return 'flag';
  }
});

const label = computed(() => {
  switch (props.priority) {
    case 'LOW': return 'Thấp';
    case 'MEDIUM': return 'Trung bình';
    case 'HIGH': return 'Cao';
    case 'URGENT': return 'Khẩn cấp';
    default: return props.priority;
  }
});
</script>
