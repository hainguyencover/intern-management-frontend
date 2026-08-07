<template>
  <div class="row items-center q-gutter-x-sm">
    <BaseInput
      :model-value="modelValue"
      :placeholder="placeholder || 'Tìm kiếm...'"
      dense
      outlined
      class="col"
      @update:model-value="onInput"
    >
      <template #append>
        <q-icon v-if="modelValue" name="close" class="cursor-pointer" @click="onClear" />
        <q-icon name="search" />
      </template>
    </BaseInput>

    <BaseButton
      v-if="hasAdvancedFilters"
      icon="filter_list"
      color="secondary"
      flat
      label="Bộ lọc"
      @click="$emit('togglePanel')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../BaseInput.vue';
import BaseButton from '../BaseButton.vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  hasAdvancedFilters?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'search', val: string): void;
  (e: 'togglePanel'): void;
}>();

let timer: any = null;

function onInput(val: string) {
  emit('update:modelValue', val);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    emit('search', val);
  }, 300);
}

function onClear() {
  emit('update:modelValue', '');
  emit('search', '');
}
</script>
