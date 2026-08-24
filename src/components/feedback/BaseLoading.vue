<template>
  <div class="row flex-center q-pa-lg text-grey-7">
    <q-spinner-dots color="primary" size="3em" />
    <span class="q-ml-sm text-subtitle1">{{ message || 'Đang tải dữ liệu...' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
