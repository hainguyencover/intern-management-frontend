<template>
  <q-select
    :model-value="modelValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :error="!!error"
    :error-message="error"
    :disabled="disabled"
    :multiple="multiple"
    outlined
    dense
    emit-value
    map-options
    class="rounded-select"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: any;
    options: any[];
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    multiple?: boolean;
  }>(),
  {
    disabled: false,
    multiple: false
  }
);

defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<style scoped lang="sass">
.rounded-select :deep(.q-field__control)
  border-radius: 10px
  background-color: #F8FAFC
</style>
