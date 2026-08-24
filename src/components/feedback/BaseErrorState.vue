<template>
  <div class="column flex-center q-pa-xl text-negative">
    <q-icon name="error_outline" size="4em" class="q-mb-md" />
    <div class="text-h6">{{ title || 'Đã xảy ra lỗi' }}</div>
    <div class="text-body2 text-grey-8 q-mt-xs">{{ message || 'Không thể tải dữ liệu vào lúc này.' }}</div>
    <q-btn
      v-if="retryable"
      color="negative"
      outline
      icon="refresh"
      label="Thử lại"
      class="q-mt-md"
      @click="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
  retryable?: boolean;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
