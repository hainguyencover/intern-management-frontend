import apiClient from '@/services/api/apiClient';
import type {
  ReportCatalogDto,
  ReportFilterRequest,
  ReportPreviewResponse,
  ReportExportRequest,
  ExportJobResponse
} from '@/types/report';

export async function getReportCatalog(): Promise<ReportCatalogDto[]> {
  const { data } = await apiClient.get<any>('/reports');
  return data.data || data;
}

export async function previewReport(
  reportCode: string,
  filter?: ReportFilterRequest
): Promise<ReportPreviewResponse> {
  const { data } = await apiClient.post<any>('/reports/preview', filter || {}, {
    params: { reportCode }
  });
  return data.data || data;
}

export async function exportReportDirect(request: ReportExportRequest): Promise<Blob> {
  const response = await apiClient.post('/reports/export', request, {
    responseType: 'blob'
  });
  return response.data;
}

export async function createExportJob(request: ReportExportRequest): Promise<ExportJobResponse> {
  const { data } = await apiClient.post<any>('/reports/export-jobs', request);
  return data.data || data;
}

export async function getExportJobStatus(jobId: string): Promise<ExportJobResponse> {
  const { data } = await apiClient.get<any>(`/reports/export-jobs/${jobId}`);
  return data.data || data;
}

export async function downloadJobFile(jobId: string): Promise<Blob> {
  const response = await apiClient.get(`/reports/export-jobs/${jobId}/download`, {
    responseType: 'blob'
  });
  return response.data;
}

export async function getExportHistory(params?: { page?: number; size?: number }): Promise<any> {
  const { data } = await apiClient.get<any>('/reports/export-history', { params });
  return data.data || data;
}
