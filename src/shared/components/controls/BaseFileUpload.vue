<template>
  <q-file
    :model-value="boundValue"
    :label="label || 'Tải đính kèm tập tin'"
    :error="!!boundError"
    :error-message="boundError"
    outlined
    dense
    clearable
    @update:model-value="onUpdate"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: File | null;
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: File | null): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue || null, props.error);
const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue || null));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

function onUpdate(val: File | null) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}
</script>
