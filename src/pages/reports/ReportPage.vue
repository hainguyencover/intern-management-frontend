<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-primary">
          <q-icon name="assessment" class="q-mr-xs" /> Báo cáo & Thống kê HR
        </div>
        <div class="text-caption text-grey-7">
          Xuất báo cáo dữ liệu thực tập sinh, phân tích hiệu suất và tổng hợp hoạt động doanh nghiệp
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="history"
          label="Lịch sử xuất báo cáo"
          to="/hr/reports/history"
          no-caps
        />
      </div>
    </div>

    <!-- Report Selector -->
    <ReportSelector
      :catalog="reportStore.catalog"
      :selected-code="reportStore.selectedReport?.code"
      @select="handleSelectReport"
    />

    <!-- Report Filters -->
    <ReportFilter
      v-if="reportStore.selectedReport"
      :available-filters="reportStore.selectedReport.availableFilters"
      :loading="reportStore.loadingPreview"
      @apply="handleApplyFilters"
    />

    <!-- Preview & Export -->
    <ReportPreview
      :preview="reportStore.preview"
      :exporting="reportStore.exporting"
      @export-direct="handleExportDirect"
      @export-job="handleExportJob"
    />

    <!-- Async Export Progress Dialog -->
    <ExportProgressDialog
      v-model="showProgressDialog"
      :job="reportStore.activeJob"
      @download="handleDownloadJob"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import type { ExportFormat, ReportFilterRequest } from '@/types/report';
import ReportSelector from '@/components/reports/ReportSelector.vue';
import ReportFilter from '@/components/reports/ReportFilter.vue';
import ReportPreview from '@/components/reports/ReportPreview.vue';
import ExportProgressDialog from '@/components/reports/ExportProgressDialog.vue';

const reportStore = useReportStore();
const showProgressDialog = ref(false);

onMounted(async () => {
  await reportStore.fetchCatalog();
  if (reportStore.selectedReport) {
    await reportStore.fetchPreview();
  }
});

async function handleSelectReport(code: string) {
  reportStore.selectReport(code);
  await reportStore.fetchPreview();
}

async function handleApplyFilters(filters: ReportFilterRequest) {
  reportStore.filters = filters;
  await reportStore.fetchPreview();
}

async function handleExportDirect(format: ExportFormat) {
  try {
    await reportStore.triggerDirectExport(format);
  } catch (err) {
    console.error('Lỗi khi xuất trực tiếp:', err);
  }
}

async function handleExportJob(format: ExportFormat) {
  try {
    showProgressDialog.value = true;
    await reportStore.triggerAsyncJob(format);
  } catch (err) {
    console.error('Lỗi khi tạo job xuất:', err);
  }
}

async function handleDownloadJob(jobId: string, fileName?: string) {
  await reportStore.downloadJob(jobId, fileName);
}
</script>
