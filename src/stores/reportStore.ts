import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  ReportCatalogDto,
  ReportFilterRequest,
  ReportPreviewResponse,
  ExportJobResponse,
  ExportFormat
} from '@/types/report';
import * as reportService from '@/services/reportService';

export const useReportStore = defineStore('reportStore', () => {
  const catalog = ref<ReportCatalogDto[]>([]);
  const selectedReport = ref<ReportCatalogDto | null>(null);
  const filters = ref<ReportFilterRequest>({});
  const preview = ref<ReportPreviewResponse | null>(null);
  const activeJob = ref<ExportJobResponse | null>(null);
  const history = ref<ExportJobResponse[]>([]);
  
  const loadingCatalog = ref(false);
  const loadingPreview = ref(false);
  const exporting = ref(false);
  const polling = ref(false);

  async function fetchCatalog() {
    loadingCatalog.value = true;
    try {
      catalog.value = await reportService.getReportCatalog();
      if (catalog.value.length > 0 && !selectedReport.value) {
        selectedReport.value = catalog.value[0];
      }
    } catch (err) {
      console.error('Failed to load report catalog:', err);
    } finally {
      loadingCatalog.value = false;
    }
  }

  function selectReport(code: string) {
    const found = catalog.value.find((r) => r.code === code);
    if (found) {
      selectedReport.value = found;
      filters.value = {};
      preview.value = null;
    }
  }

  async function fetchPreview() {
    if (!selectedReport.value) return;
    loadingPreview.value = true;
    try {
      preview.value = await reportService.previewReport(
        selectedReport.value.code,
        filters.value
      );
    } catch (err) {
      console.error('Failed to fetch report preview:', err);
      preview.value = null;
    } finally {
      loadingPreview.value = false;
    }
  }

  async function triggerDirectExport(format: ExportFormat) {
    if (!selectedReport.value) return;
    exporting.value = true;
    try {
      const blob = await reportService.exportReportDirect({
        reportCode: selectedReport.value.code,
        format,
        filters: filters.value
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedReport.value.code.toLowerCase()}_report.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Direct export failed:', err);
      throw err;
    } finally {
      exporting.value = false;
    }
  }

  async function triggerAsyncJob(format: ExportFormat) {
    if (!selectedReport.value) return;
    exporting.value = true;
    try {
      const job = await reportService.createExportJob({
        reportCode: selectedReport.value.code,
        format,
        filters: filters.value
      });
      activeJob.value = job;
      startPolling(job.jobId);
    } catch (err) {
      console.error('Failed to create export job:', err);
      exporting.value = false;
      throw err;
    }
  }

  let pollTimer: any = null;
  function startPolling(jobId: string) {
    polling.value = true;
    if (pollTimer) clearInterval(pollTimer);

    pollTimer = setInterval(async () => {
      try {
        const job = await reportService.getExportJobStatus(jobId);
        activeJob.value = job;
        if (job.status === 'READY' || job.status === 'FAILED' || job.status === 'EXPIRED') {
          stopPolling();
          exporting.value = false;
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        stopPolling();
        exporting.value = false;
      }
    }, 2000);
  }

  function stopPolling() {
    polling.value = false;
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  async function downloadJob(jobId: string, fileName?: string) {
    try {
      const blob = await reportService.downloadJobFile(jobId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `export_report_${jobId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download job file:', err);
      throw err;
    }
  }

  async function fetchHistory() {
    try {
      const res = await reportService.getExportHistory();
      history.value = res.content || res;
    } catch (err) {
      console.error('Failed to fetch export history:', err);
    }
  }

  return {
    catalog,
    selectedReport,
    filters,
    preview,
    activeJob,
    history,
    loadingCatalog,
    loadingPreview,
    exporting,
    polling,
    fetchCatalog,
    selectReport,
    fetchPreview,
    triggerDirectExport,
    triggerAsyncJob,
    downloadJob,
    fetchHistory,
    stopPolling
  };
});
