<template>
  <div
    class="dropzone-area text-center q-pa-lg rounded-borders cursor-pointer"
    :class="{ 'dropzone-active': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="openFilePicker"
  >
    <input ref="fileInput" type="file" multiple class="hidden" @change="onFilePicked" />
    <q-icon name="cloud_upload" size="48px" color="primary" class="q-mb-sm" />
    <div class="text-subtitle1 text-bold">Kéo & thả tập tin đính kèm vào đây</div>
    <div class="text-caption text-grey-6">Hoặc bấm để chọn tập tin từ máy tính</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'filesSelected', files: File[]): void;
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    emit('filesSelected', Array.from(e.dataTransfer.files));
  }
}

function onFilePicked(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    emit('filesSelected', Array.from(target.files));
  }
}
</script>

<style scoped>
.dropzone-area {
  border: 2px dashed #1976d2;
  background-color: #f5f9ff;
  transition: all 0.2s ease-in-out;
}
.dropzone-active {
  background-color: #e3f2fd;
  border-color: #0d47a1;
}
</style>
