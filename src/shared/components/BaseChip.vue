<template>
  <q-chip
    :label="label"
    :icon="icon"
    :color="quasarColor"
    text-color="white"
    :removable="removable"
    @remove="$emit('remove')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    color?: ChipColor;
    removable?: boolean;
  }>(),
  {
    color: 'primary',
    removable: false
  }
);

defineEmits<{
  (e: 'remove'): void;
}>();

const quasarColor = computed(() => {
  const map: Record<ChipColor, string> = {
    primary: 'primary',
    secondary: 'grey-7',
    success: 'emerald',
    warning: 'amber-8',
    danger: 'negative',
    info: 'cyan-8'
  };
  return map[props.color];
});
</script>
