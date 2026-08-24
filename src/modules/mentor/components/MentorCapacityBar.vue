<template>
  <div class="capacity-container">
    <div class="row items-center justify-between text-caption q-mb-xs">
      <span class="text-weight-medium">
        {{ assigned }} / {{ capacity }} TTS
      </span>
      <span :class="`text-${barColor} text-weight-bold`">
        {{ percentage.toFixed(0) }}% ({{ statusLabel }})
      </span>
    </div>
    <q-linear-progress
      :value="percentage / 100"
      :color="barColor"
      track-color="grey-3"
      size="10px"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    assigned: number;
    capacity: number;
  }>(),
  {
    assigned: 0,
    capacity: 5,
  }
);

const percentage = computed(() => {
  if (!props.capacity || props.capacity <= 0) return 0;
  return (props.assigned / props.capacity) * 100;
});

const barColor = computed(() => {
  const pct = percentage.value;
  if (pct > 100) return 'negative';
  if (pct > 80) return 'deep-orange';
  if (pct > 60) return 'warning';
  return 'positive';
});

const statusLabel = computed(() => {
  const pct = percentage.value;
  if (pct > 100) return 'Quá tải';
  if (pct > 80) return 'Gần đầy';
  if (pct > 60) return 'Vừa phải';
  return 'Sẵn sàng';
});
</script>

<style scoped>
.capacity-container {
  min-width: 140px;
}
</style>
