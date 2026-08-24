import apiClient from '@/services/api/apiClient';
import type {
  IntegrationConnection,
  IntegrationConnectionRequest,
  ConnectionTestResult,
  SyncJob
} from '@/types/integration';

export async function getConnections(): Promise<IntegrationConnection[]> {
  const { data } = await apiClient.get<any>('/integrations');
  return data.data || data;
}

export async function getConnectionById(id: number): Promise<IntegrationConnection> {
  const { data } = await apiClient.get<any>(`/integrations/${id}`);
  return data.data || data;
}

export async function createConnection(request: IntegrationConnectionRequest): Promise<IntegrationConnection> {
  const { data } = await apiClient.post<any>('/integrations', request);
  return data.data || data;
}

export async function updateConnection(id: number, request: Partial<IntegrationConnectionRequest>): Promise<IntegrationConnection> {
  const { data } = await apiClient.put<any>(`/integrations/${id}`, request);
  return data.data || data;
}

export async function deleteConnection(id: number): Promise<void> {
  await apiClient.delete(`/integrations/${id}`);
}

export async function testConnection(id: number): Promise<ConnectionTestResult> {
  const { data } = await apiClient.post<any>(`/integrations/${id}/test`);
  return data.data || data;
}

export async function triggerHrmSync(connectionId: number): Promise<SyncJob> {
  const { data } = await apiClient.post<any>('/integrations/hrm/sync', { connectionId });
  return data.data || data;
}

export async function getSyncJobStatus(jobId: number): Promise<SyncJob> {
  const { data } = await apiClient.get<any>(`/integrations/hrm/jobs/${jobId}`);
  return data.data || data;
}

export async function getSyncJobHistory(connectionId: number): Promise<SyncJob[]> {
  const { data } = await apiClient.get<any>('/integrations/hrm/jobs', { params: { connectionId } });
  return data.data || data;
}
