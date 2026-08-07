<template>
  <div class="row justify-center q-py-md">
    <q-pagination
      :model-value="modelValue"
      :max="max"
      :disabled="disabled"
      input
      color="primary"
      boundary-links
      @update:model-value="(val) => $emit('update:modelValue', val)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number;
    max: number;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();
</script>
