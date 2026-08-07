<template>
  <div class="search-toolbar-wrapper">
    <q-input
      :model-value="modelValue"
      :placeholder="placeholder"
      :loading="loading"
      outlined
      dense
      class="rounded-search"
      @update:model-value="onInput"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append v-if="modelValue">
        <q-icon name="clear" class="cursor-pointer" @click="clearSearch" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    loading?: boolean;
    placeholder?: string;
  }>(),
  {
    loading: false,
    placeholder: 'Tìm kiếm...'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

let debounceTimer: any = null;

function onInput(val: any) {
  const query = val as string;
  emit('update:modelValue', query);
  
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', query);
  }, 300); // 300ms debounce
}

function clearSearch() {
  emit('update:modelValue', '');
  emit('search', '');
}
</script>

<style scoped lang="sass">
.rounded-search :deep(.q-field__control)
  border-radius: 10px
  background-color: #F8FAFC
</style>
