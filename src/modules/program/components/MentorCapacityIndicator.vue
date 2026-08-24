<template>
  <div class="mentor-capacity-indicator">
    <div class="row items-center justify-between q-mb-xs">
      <span class="text-caption text-weight-medium">Tải Mentor</span>
      <q-badge :color="badgeColor" class="q-px-sm">
        {{ count }} / {{ maxCapacity }}
        <span v-if="isFull" class="q-ml-xs text-weight-bold">(Đầy)</span>
      </q-badge>
    </div>
    <q-linear-progress
      :value="progressValue"
      :color="progressColor"
      track-color="grey-3"
      size="8px"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  count: number
  maxCapacity?: number
}>(), {
  maxCapacity: 5
})

const isFull = computed(() => props.count >= props.maxCapacity)
const isNearFull = computed(() => props.count === props.maxCapacity - 1)

const progressValue = computed(() => Math.min(1, props.count / props.maxCapacity))

const progressColor = computed(() => {
  if (isFull.value) return 'negative'
  if (isNearFull.value) return 'warning'
  return 'positive'
})

const badgeColor = computed(() => {
  if (isFull.value) return 'red-8'
  if (isNearFull.value) return 'amber-9'
  return 'green-7'
})
</script>

<style scoped>
.mentor-capacity-indicator {
  min-width: 140px;
}
</style>
