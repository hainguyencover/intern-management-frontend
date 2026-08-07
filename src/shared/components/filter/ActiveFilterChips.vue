<template>
  <div v-if="chips.length > 0" class="row items-center q-gutter-xs q-mt-xs">
    <span class="text-caption text-grey-7">Đang lọc theo:</span>
    <q-chip
      v-for="chip in chips"
      :key="chip.key"
      removable
      dense
      color="primary"
      text-color="white"
      @remove="$emit('remove', chip.key)"
    >
      {{ chip.label }}: {{ chip.displayValue }}
    </q-chip>
    <BaseButton
      flat
      dense
      label="Xóa tất cả"
      color="negative"
      size="sm"
      @click="$emit('clearAll')"
    />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../BaseButton.vue';
import type { ActiveChip } from './filterTypes';

defineProps<{
  chips: ActiveChip[];
}>();

defineEmits<{
  (e: 'remove', key: string): void;
  (e: 'clearAll'): void;
}>();
</script>
