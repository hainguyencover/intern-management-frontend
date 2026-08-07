<template>
  <q-badge :color="quasarColor" class="ims-badge text-bold">
    {{ label }}
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

const props = withDefaults(
  defineProps<{
    label?: string;
    color?: BadgeColor;
  }>(),
  {
    color: 'primary'
  }
);

const quasarColor = computed(() => {
  const map: Record<BadgeColor, string> = {
    primary: 'primary',
    secondary: 'grey-7',
    success: 'emerald', // Map to design system colors
    warning: 'amber-8',
    danger: 'negative',
    info: 'cyan-8'
  };
  return map[props.color];
});
</script>

<style scoped lang="sass">
.ims-badge
  padding: 4px 8px
  border-radius: 4px
</style>
