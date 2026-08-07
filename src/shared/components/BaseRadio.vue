<template>
  <q-radio
    :model-value="modelValue"
    :val="val"
    :label="label"
    :disabled="disabled"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: any;
    val: any;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>
