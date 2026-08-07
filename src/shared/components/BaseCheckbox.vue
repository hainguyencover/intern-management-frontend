<template>
  <q-checkbox
    :model-value="modelValue"
    :label="label"
    :disabled="disabled"
    @update:model-value="(val) => $emit('update:modelValue', val as boolean)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
