import apiClient from '@/services/api/apiClient';
import type { AuditLogItem, AuditLogFilter } from '@/types/auditLog';

export async function getAuditLogs(filter?: AuditLogFilter): Promise<{ content: AuditLogItem[]; totalElements: number; totalPages: number }> {
  const { data } = await apiClient.get('/audit-logs', { params: filter });
  return data.data || data;
}

export async function getAuditLogById(id: number): Promise<AuditLogItem> {
  const { data } = await apiClient.get(`/audit-logs/${id}`);
  return data.data || data;
}

export async function exportAuditLogs(filter?: AuditLogFilter): Promise<Blob> {
  const response = await apiClient.get('/audit-logs/export', {
    params: filter,
    responseType: 'blob'
  });
  return response.data;
}
