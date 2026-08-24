<template>
  <div class="program-capacity-indicator">
    <div class="row items-center justify-between q-mb-xs">
      <span class="text-caption text-weight-medium text-grey-8">Sức chứa chương trình</span>
      <q-badge :color="badgeColor" class="q-px-sm">
        {{ current }} {{ max ? `/ ${max}` : '' }} TTS
        <span v-if="isFull" class="q-ml-xs text-weight-bold">(Đầy)</span>
        <span v-else-if="isNearFull" class="q-ml-xs text-weight-bold">(Gần đầy)</span>
      </q-badge>
    </div>
    <q-linear-progress
      v-if="max"
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
  current: number
  max?: number | null
}>(), {
  max: null
})

const isFull = computed(() => !!props.max && props.current >= props.max)
const progressValue = computed(() => props.max ? Math.min(1, props.current / props.max) : 0)
const isNearFull = computed(() => !!props.max && progressValue.value >= 0.8 && !isFull.value)

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
.program-capacity-indicator {
  min-width: 160px;
}
</style>
