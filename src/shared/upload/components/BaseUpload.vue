<template>
  <div class="base-upload-container">
    <BaseDropzone @files-selected="onFilesSelected" />
    <AttachmentList :items="uploadStore.items" />
  </div>
</template>

<script setup lang="ts">
import BaseDropzone from './BaseDropzone.vue';
import AttachmentList from './AttachmentList.vue';
import { useUploadStore } from '../uploadStore';
import { uploadManager } from '../uploadManager';
import type { UploadPolicy } from '../uploadTypes';

const props = defineProps<{
  policy?: UploadPolicy;
}>();

const uploadStore = useUploadStore();

async function onFilesSelected(files: File[]) {
  for (const file of files) {
    try {
      await uploadManager.addAndStartUpload(file, props.policy);
    } catch (err: any) {
      alert(err.message || 'Lỗi tải tập tin');
    }
  }
}
</script>
