<template>
  <div :class="gridCol" v-can="permission">
    <!-- Local Error Boundary fallback -->
    <BaseCard v-if="hasError" class="bg-negative text-white q-pa-md">
      <div class="row items-center justify-between">
        <div>
          <div class="text-bold">Widget {{ title }} gặp sự cố</div>
          <div class="text-caption">Không thể tải dữ liệu widget này.</div>
        </div>
        <q-btn flat dense icon="refresh" label="Thử lại" @click="retry" />
      </div>
    </BaseCard>

    <!-- Component Render with Error Boundary -->
    <component
      v-else
      :is="component"
      v-bind="componentProps"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import BaseCard from '../../../shared/components/BaseCard.vue';

const props = defineProps<{
  title: string;
  component: any;
  gridCol: string;
  permission?: string;
  componentProps?: Record<string, any>;
}>();

const hasError = ref(false);

onErrorCaptured((err) => {
  hasError.value = true;
  return false; // Prevent error propagation to parent page
});

function retry() {
  hasError.value = false;
}
</script>
