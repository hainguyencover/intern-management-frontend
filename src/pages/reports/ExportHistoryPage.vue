<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-primary">
          <q-icon name="history" class="q-mr-xs" /> Lịch sử xuất báo cáo
        </div>
        <div class="text-caption text-grey-7">
          Danh sách các yêu cầu xuất báo cáo và trạng thái lưu trữ các file đã tạo trong hệ thống
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Quay lại Xuất báo cáo"
          to="/hr/reports"
          no-caps
        />
        <q-btn
          flat
          round
          dense
          icon="refresh"
          @click="loadHistory"
        />
      </div>
    </div>

    <!-- History Table -->
    <q-card flat bordered>
      <q-table
        flat
        :rows="reportStore.history"
        :columns="columns"
        row-key="jobId"
        dense
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              size="sm"
              :color="getStatusColor(props.row.status)"
              text-color="white"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-fileSize="props">
          <q-td :props="props">
            {{ formatFileSize(props.row.fileSize) }}
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="text-center">
            <q-btn
              v-if="props.row.status === 'READY'"
              dense
              flat
              color="positive"
              icon="download"
              label="Tải về"
              no-caps
              @click="reportStore.downloadJob(props.row.jobId, props.row.fileName)"
            />
            <span v-else class="text-caption text-grey-5">-</span>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import type { ExportJobStatus } from '@/types/report';

const reportStore = useReportStore();

const columns = [
  { name: 'jobId', label: 'Mã Yêu cầu', field: 'jobId', align: 'left' as const, sortable: true },
  { name: 'reportCode', label: 'Loại báo cáo', field: 'reportCode', align: 'left' as const, sortable: true },
  { name: 'format', label: 'Định dạng', field: 'format', align: 'center' as const, sortable: true },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const, sortable: true },
  { name: 'recordCount', label: 'Số bản ghi', field: 'recordCount', align: 'right' as const, sortable: true },
  { name: 'fileSize', label: 'Dung lượng', field: 'fileSize', align: 'right' as const },
  { name: 'createdAt', label: 'Thời gian tạo', field: 'createdAt', align: 'left' as const, sortable: true },
  { name: 'action', label: 'Thao tác', field: 'action', align: 'center' as const }
];

onMounted(() => {
  loadHistory();
});

async function loadHistory() {
  await reportStore.fetchHistory();
}

function getStatusColor(status: ExportJobStatus): string {
  switch (status) {
    case 'READY': return 'positive';
    case 'PROCESSING': return 'warning';
    case 'QUEUED': return 'info';
    case 'FAILED': return 'negative';
    case 'EXPIRED': return 'grey-7';
    default: return 'grey';
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '-';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('vi-VN');
}
</script>
