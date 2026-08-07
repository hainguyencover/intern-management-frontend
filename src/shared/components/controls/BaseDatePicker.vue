<template>
  <BaseInput
    :model-value="boundValue"
    :label="label"
    :placeholder="placeholder || 'YYYY-MM-DD'"
    :error="boundError"
    readonly
    class="cursor-pointer"
    @update:model-value="onUpdate"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            :model-value="boundValue"
            mask="YYYY-MM-DD"
            @update:model-value="onDateSelected"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Đóng" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseInput from '../BaseInput.vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: string;
  label?: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue, props.error);

const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

function onUpdate(val: string) {
  if (props.name) formCtrl.value.value = val;
  emit('update:modelValue', val);
}

function onDateSelected(val: string) {
  onUpdate(val);
}
</script>
