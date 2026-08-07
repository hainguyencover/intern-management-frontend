<template>
  <q-drawer
    :model-value="modelValue"
    :side="side"
    :bordered="bordered"
    :width="width"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <slot />
  </q-drawer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    side?: 'left' | 'right';
    bordered?: boolean;
    width?: number;
  }>(),
  {
    side: 'left',
    bordered: true,
    width: 250
  }
);

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
