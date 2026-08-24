<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-h6 text-weight-bold">
          <q-icon name="cloud_download" class="q-mr-xs" /> Đang xuất báo cáo trong nền
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md text-center" v-if="job">
        <div class="q-my-md" v-if="job.status === 'QUEUED' || job.status === 'PROCESSING'">
          <q-spinner-gears color="primary" size="50px" />
          <div class="text-subtitle1 text-weight-bold q-mt-md">
            {{ job.status === 'QUEUED' ? 'Đang xếp hàng...' : 'Đang tổng hợp dữ liệu & tạo file...' }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Mã yêu cầu: <strong>{{ job.jobId }}</strong>
          </div>
          <q-linear-progress query color="primary" class="q-mt-md" />
        </div>

        <div class="q-my-md" v-else-if="job.status === 'READY'">
          <q-icon name="check_circle" color="positive" size="50px" />
          <div class="text-h6 text-weight-bold text-positive q-mt-sm">Tạo file báo cáo thành công!</div>
          <div class="text-body2 text-grey-8 q-mt-xs">
            File: <strong>{{ job.fileName }}</strong> ({{ formatFileSize(job.fileSize) }})
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Số lượng bản ghi: <strong>{{ job.recordCount }}</strong> | Hết hạn vào: {{ formatDate(job.expiresAt) }}
          </div>

          <div class="q-mt-lg">
            <q-btn
              color="positive"
              icon="file_download"
              label="Tải file về máy"
              size="lg"
              class="full-width"
              @click="$emit('download', job.jobId, job.fileName)"
            />
          </div>
        </div>

        <div class="q-my-md" v-else-if="job.status === 'FAILED'">
          <q-icon name="error" color="negative" size="50px" />
          <div class="text-h6 text-weight-bold text-negative q-mt-sm">Xuất báo cáo thất bại</div>
          <div class="text-body2 text-grey-8 q-mt-xs">{{ job.errorMessage || 'Đã có lỗi xảy ra trong quá trình xuất dữ liệu.' }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Đóng" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { ExportJobResponse } from '@/types/report';

defineProps<{
  modelValue: boolean;
  job: ExportJobResponse | null;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'download', jobId: string, fileName?: string): void;
}>();

function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN');
}
</script>
