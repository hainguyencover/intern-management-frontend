<template>
  <div class="row justify-center q-py-sm">
    <q-pagination
      :model-value="modelValue"
      :max="max"
      :disabled="disabled"
      dense
      size="md"
      color="primary"
      direction-links
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
