<template>
  <q-list v-if="items.length > 0" separator bordered class="rounded-borders q-mt-md">
    <q-item v-for="item in items" :key="item.id">
      <q-item-section avatar>
        <q-icon name="insert_drive_file" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-bold">{{ item.name }}</q-item-label>
        <q-item-label caption>
          {{ (item.size / (1024 * 1024)).toFixed(2) }} MB •
          <span :class="statusColorClass(item.status)">{{ statusText(item.status) }}</span>
        </q-item-label>
        <q-linear-progress
          :value="item.progress / 100"
          :color="item.status === 'completed' ? 'positive' : 'primary'"
          class="q-mt-xs"
        />
      </q-item-section>

      <q-item-section side class="row q-gutter-x-xs">
        <q-btn
          v-if="item.status === 'uploading'"
          flat
          round
          dense
          icon="pause"
          color="warning"
          @click="uploadManager.pauseUpload(item.id)"
        />
        <q-btn
          v-if="item.status === 'paused'"
          flat
          round
          dense
          icon="play_arrow"
          color="primary"
          @click="uploadManager.resumeUpload(item.id)"
        />
        <q-btn
          flat
          round
          dense
          icon="close"
          color="negative"
          @click="uploadManager.cancelUpload(item.id)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { uploadManager } from '../uploadManager';
import type { UploadFileItem, UploadStatus } from '../uploadTypes';

defineProps<{
  items: UploadFileItem[];
}>();

function statusText(status: UploadStatus) {
  switch (status) {
    case 'uploading':
      return 'Đang tải lên...';
    case 'paused':
      return 'Đã tạm dừng';
    case 'completed':
      return 'Đã hoàn tất';
    case 'failed':
      return 'Thất bại';
    default:
      return 'Đang chờ';
  }
}

function statusColorClass(status: UploadStatus) {
  switch (status) {
    case 'completed':
      return 'text-positive text-bold';
    case 'failed':
      return 'text-negative text-bold';
    case 'paused':
      return 'text-warning text-bold';
    default:
      return 'text-primary';
  }
}
</script>
