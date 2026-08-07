<template>
  <q-input
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :error="!!error"
    :error-message="error"
    :disabled="disabled"
    type="textarea"
    :rows="rows"
    outlined
    class="rounded-textarea"
    @update:model-value="(val) => $emit('update:modelValue', val as string)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    error?: string;
    rows?: number;
    disabled?: boolean;
  }>(),
  {
    rows: 4,
    disabled: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped lang="sass">
.rounded-textarea :deep(.q-field__control)
  border-radius: 10px
  background-color: #F8FAFC
</style>
