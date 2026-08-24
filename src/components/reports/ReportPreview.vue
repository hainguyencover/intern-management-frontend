<template>
  <q-card flat bordered v-if="preview">
    <!-- Action Banner Header -->
    <q-card-section class="bg-grey-2 q-pb-none">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold text-primary">{{ preview.reportName }}</div>
          <div class="text-caption text-grey-7">
            Tổng cộng <strong>{{ preview.totalRecords }}</strong> bản ghi | Thời điểm tạo: {{ formatDate(preview.generatedAt) }}
          </div>
        </div>

        <div class="q-gutter-sm row items-center">
          <q-btn
            color="positive"
            icon="description"
            label="Xuất Excel (.xlsx)"
            no-caps
            :loading="exporting"
            @click="$emit('exportDirect', 'XLSX')"
          />
          <q-btn
            color="negative"
            icon="picture_as_pdf"
            label="Xuất PDF (.pdf)"
            no-caps
            :loading="exporting"
            @click="$emit('exportDirect', 'PDF')"
          />
          <q-btn
            color="secondary"
            icon="cloud_download"
            label="Xuất Async (Job)"
            no-caps
            :loading="exporting"
            @click="$emit('exportJob', 'XLSX')"
          >
            <q-tooltip>Dùng cho tập dữ liệu lớn để tải về trong nền</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-sm q-mt-md" v-if="preview.summary && Object.keys(preview.summary).length">
        <div
          v-for="(val, key) in preview.summary"
          :key="key"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card flat class="bg-white bordered-subtle">
            <q-card-section class="q-pa-sm">
              <div class="text-caption text-grey-7 text-uppercase text-weight-medium line-clamp-1">{{ key }}</div>
              <div class="text-h6 text-weight-bold text-primary text-truncate">{{ val }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <!-- Data Table -->
    <q-card-section class="q-pt-md">
      <q-input
        v-model="search"
        dense
        outlined
        placeholder="Tìm kiếm trong xem trước..."
        class="q-mb-md"
        style="max-width: 300px"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-table
        flat
        bordered
        :rows="preview.rows"
        :columns="tableColumns"
        row-key="id"
        :filter="search"
        :pagination="pagination"
        dense
      >
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-pa-md">
            <q-icon name="warning" size="md" class="q-mr-sm" /> Không có dữ liệu phù hợp với bộ lọc.
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ReportPreviewResponse, ExportFormat } from '@/types/report';

const props = defineProps<{
  preview: ReportPreviewResponse | null;
  exporting?: boolean;
}>();

defineEmits<{
  (e: 'exportDirect', format: ExportFormat): void;
  (e: 'exportJob', format: ExportFormat): void;
}>();

const search = ref('');
const pagination = ref({
  rowsPerPage: 15
});

const tableColumns = computed(() => {
  if (!props.preview || !props.preview.columns) return [];
  return props.preview.columns.map((col) => ({
    name: col,
    label: col,
    field: col,
    align: 'left' as const,
    sortable: true
  }));
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN');
}
</script>

<style scoped>
.bordered-subtle {
  border: 1px solid #e0e0e0;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
