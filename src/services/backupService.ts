import apiClient from '@/services/api/apiClient';
import type { BackupJob, BackupJobQuery } from '@/types/backup';

export async function getBackupHistory(query?: BackupJobQuery): Promise<{ content: BackupJob[]; totalElements: number; totalPages: number }> {
  const { data } = await apiClient.get('/admin/backups', { params: query });
  return data.data || data;
}

export async function triggerManualBackup(backupType: string = 'FULL'): Promise<BackupJob> {
  const { data } = await apiClient.post('/admin/backups', { backupType });
  return data.data || data;
}

export async function restoreBackup(id: number, confirmationCode: string): Promise<void> {
  await apiClient.post(`/admin/backups/${id}/restore`, { confirmationCode });
}

export async function downloadBackupFile(id: number): Promise<Blob> {
  const response = await apiClient.get(`/admin/backups/${id}/download`, { responseType: 'blob' });
  return response.data;
}
