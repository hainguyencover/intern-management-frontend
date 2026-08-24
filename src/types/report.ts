export type ExportFormat = 'XLSX' | 'PDF';

export type ExportJobStatus = 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface ReportCatalogDto {
  code: string;
  name: string;
  description: string;
  category: string;
  supportedFormats: ExportFormat[];
  availableFilters: string[];
}

export interface ReportFilterRequest {
  programId?: number | null;
  departmentId?: number | null;
  universityId?: number | null;
  majorId?: number | null;
  mentorId?: number | null;
  internStatus?: string | null;
  internshipPeriod?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  customFilters?: Record<string, any>;
}

export interface ReportExportRequest {
  reportCode: string;
  format: ExportFormat;
  filters?: ReportFilterRequest;
}

export interface ReportPreviewResponse {
  reportCode: string;
  reportName: string;
  totalRecords: number;
  columns: string[];
  rows: Record<string, any>[];
  summary: Record<string, any>;
  generatedAt: string;
}

export interface ExportJobResponse {
  jobId: string;
  reportCode: string;
  format: ExportFormat;
  status: ExportJobStatus;
  fileName?: string;
  fileSize?: number;
  recordCount?: number;
  errorMessage?: string;
  requestedBy: number;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  downloadUrl?: string;
}
