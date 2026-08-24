<template>
  <div class="column flex-center q-pa-xl text-grey-6">
    <q-icon :name="icon || 'sentiment_dissatisfied'" size="4em" class="q-mb-md" />
    <div class="text-h6 text-grey-8">{{ title || 'Không tìm thấy dữ liệu' }}</div>
    <div class="text-caption text-grey-6 q-mt-xs">{{ description || 'Hiện chưa có mục nào trong danh sách.' }}</div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title?: string;
  description?: string;
}>();
</script>
