<template>
  <BaseSelect
    :model-value="boundValue"
    :options="mentorOptions"
    :label="label || 'Chọn Mentor phụ trách'"
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

const mentorOptions = [
  { label: 'Trần Văn Mentor (Senior Tech)', value: 'mentor-1' },
  { label: 'Lê Thị Mentor Mới (Tech Lead)', value: 'mentor-2' },
  { label: 'Phạm Văn Senior (QA Lead)', value: 'mentor-3' }
];

function onUpdate(val: string) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}
</script>
