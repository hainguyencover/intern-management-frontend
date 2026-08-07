<template>
  <BaseSelect
    :model-value="boundValue"
    :options="filteredOptions"
    :label="label"
    :error="boundError"
    use-input
    input-debounce="200"
    @filter="filterFn"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseSelect from '../BaseSelect.vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: any;
  options: { label: string; value: any }[];
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue, props.error);
const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

const filteredOptions = ref([...props.options]);

function filterFn(val: string, update: (fn: () => void) => void) {
  update(() => {
    if (!val) {
      filteredOptions.value = [...props.options];
    } else {
      const q = val.toLowerCase();
      filteredOptions.value = props.options.filter((o) => o.label.toLowerCase().includes(q));
    }
  });
}

function onUpdate(val: any) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}
</script>
