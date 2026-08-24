export type IntegrationType = 'HRM' | 'ATTENDANCE_QR' | 'ATTENDANCE_CARD';

export type ConnectionStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR';

export type SyncStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED' | 'CANCELLED';

export interface IntegrationConnection {
  id: number;
  code: string;
  name: string;
  integrationType: IntegrationType;
  provider: string;
  baseUrl?: string;
  status: ConnectionStatus;
  authType?: string;
  enabled: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConnectionRequest {
  code: string;
  name: string;
  integrationType: IntegrationType;
  provider: string;
  baseUrl?: string;
  authType?: string;
  enabled?: boolean;
  credentials?: Record<string, string>;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs: number;
}

export interface SyncJob {
  id: number;
  connectionId: number;
  connectionCode: string;
  syncType: string;
  direction: 'INBOUND' | 'OUTBOUND';
  status: SyncStatus;
  startedAt?: string;
  completedAt?: string;
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
}
