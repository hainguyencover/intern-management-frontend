<template>
  <div class="row items-center q-gutter-x-md">
    <q-avatar size="64px" color="grey-3" text-color="primary">
      <img v-if="previewUrl" :src="previewUrl" />
      <q-icon v-else name="person" size="36px" />
    </q-avatar>
    <div>
      <q-file
        :model-value="boundValue"
        label="Tải ảnh đại diện"
        accept="image/*"
        dense
        outlined
        @update:model-value="onFileSelected"
      >
        <template #prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>
      <div v-if="boundError" class="text-caption text-negative q-mt-xs">{{ boundError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFormControl } from './useFormControl';

const props = defineProps<{
  name?: string;
  modelValue?: File | null;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: File | null): void;
}>();

const formCtrl = useFormControl(props.name, props.modelValue || null, props.error);
const boundValue = computed(() => (props.name ? formCtrl.value.value : props.modelValue || null));
const boundError = computed(() => (props.name ? formCtrl.error.value : props.error));

const previewUrl = ref<string | null>(null);

function onFileSelected(file: File | null) {
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
  if (props.name) formCtrl.value.value = file;
  emit('update:modelValue', file);
}
</script>
