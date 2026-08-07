<template>
  <div class="row q-col-gutter-sm items-center q-pb-md">
    <div v-for="field in fields" :key="field.key" class="col-12 col-sm-3">
      <q-select
        v-model="localFilters[field.key]"
        :options="field.options"
        :label="field.label"
        outlined
        dense
        emit-value
        map-options
        class="rounded-filter-select"
        @update:model-value="onFilterChange"
      />
    </div>
    <div class="col-auto">
      <q-btn flat label="Reset" color="grey-7" no-caps @click="resetFilters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: Record<string, any>;
  fields: Array<{
    key: string;
    label: string;
    options: Array<{ label: string; value: any }>;
  }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'apply'): void;
  (e: 'reset'): void;
}>();

const localFilters = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localFilters, newVal);
  },
  { deep: true }
);

function onFilterChange() {
  emit('update:modelValue', { ...localFilters });
  emit('apply');
}

function resetFilters() {
  Object.keys(localFilters).forEach((key) => {
    localFilters[key] = null;
  });
  emit('update:modelValue', { ...localFilters });
  emit('reset');
}
</script>

<style scoped lang="sass">
.rounded-filter-select :deep(.q-field__control)
  border-radius: 10px
  background-color: #F8FAFC
</style>
