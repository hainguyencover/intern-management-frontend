<template>
  <q-select
    :model-value="boundValue"
    :label="label"
    :error="!!boundError"
    :error-message="boundError"
    use-input
    use-chips
    multiple
    hide-dropdown-icon
    new-value-mode="add-unique"
    outlined
    dense
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: string[];
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue || [], props.error);
const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue || []));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

function onUpdate(val: string[]) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}
</script>
