export interface BackupJob {
  id: number;
  tenantId?: number;
  backupType: 'FULL' | 'INCREMENTAL';
  type: 'MANUAL' | 'SCHEDULED';
  status: 'RUNNING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  filePath?: string;
  storagePath?: string;
  fileSize?: number;
  checksum?: string;
  startedAt?: string;
  finishedAt?: string;
  retentionUntil?: string;
  errorCode?: string;
  errorMessage?: string;
  message?: string;
  createdByUsername?: string;
  createdAt?: string;
}

export interface BackupJobQuery {
  page?: number;
  size?: number;
}
