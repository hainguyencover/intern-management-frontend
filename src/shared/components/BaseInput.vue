<template>
  <q-input
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :error="!!error"
    :error-message="error"
    :type="type"
    :disabled="disabled"
    outlined
    dense
    class="rounded-input"
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
    type?: 'text' | 'password' | 'email';
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    disabled: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped lang="sass">
.rounded-input :deep(.q-field__control)
  border-radius: 10px
  background-color: #F8FAFC
</style>
