<template>
  <BaseSelect
    :model-value="boundValue"
    :options="departmentOptions"
    :label="label || 'Chọn Phòng ban'"
    :error="boundError"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseSelect from '../BaseSelect.vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: string;
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue || '', props.error);
const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue || ''));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

const departmentOptions = [
  { label: 'Phòng Phát triển Phần mềm (Tech)', value: 'dept-1' },
  { label: 'Phòng Kiểm thử Chất lượng (QA)', value: 'dept-2' },
  { label: 'Phòng Quản trị Nhân sự (HR)', value: 'dept-3' }
];

function onUpdate(val: string) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}
</script>
