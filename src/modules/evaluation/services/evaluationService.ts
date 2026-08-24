import { apiClient } from '../../../shared/api/client';
import type {
  EvaluationDetail,
  PendingEvaluation,
  CreateDraftPayload,
  UpdateDraftPayload,
  FinalReportDetail
} from '../models/evaluation';
import type { PageResponse } from '../../intern/models/intern';

export async function fetchEvaluations(query?: any): Promise<PageResponse<EvaluationDetail>> {
  const response = await apiClient.get<any>('/api/v2/evaluations', { params: query });
  const resData = response.data?.data || response.data;
  const contentList = Array.isArray(resData) ? resData : (resData?.content || []);
  return {
    content: contentList,
    page: (resData?.number || 0) + 1,
    limit: resData?.size || 10,
    totalElements: resData?.totalElements || contentList.length,
    totalPages: resData?.totalPages || 1
  };
}

export async function fetchPendingEvaluations(): Promise<PendingEvaluation[]> {
  const response = await apiClient.get<any>('/api/v2/evaluations/pending');
  return response.data?.data || response.data || [];
}

export async function fetchEvaluationById(id: number): Promise<EvaluationDetail> {
  const response = await apiClient.get<any>(`/api/v2/evaluations/${id}`);
  return response.data?.data || response.data;
}

export async function createEvaluationDraft(payload: CreateDraftPayload): Promise<EvaluationDetail> {
  const response = await apiClient.post<any>('/api/v2/evaluations', payload);
  return response.data?.data || response.data;
}

export async function updateEvaluationDraft(id: number, payload: UpdateDraftPayload): Promise<EvaluationDetail> {
  const response = await apiClient.put<any>(`/api/v2/evaluations/${id}`, payload);
  return response.data?.data || response.data;
}

export async function submitEvaluation(id: number): Promise<EvaluationDetail> {
  const response = await apiClient.post<any>(`/api/v2/evaluations/${id}/submit`);
  return response.data?.data || response.data;
}

export async function approveEvaluation(id: number): Promise<EvaluationDetail> {
  const response = await apiClient.post<any>(`/api/v2/evaluations/${id}/approve`);
  return response.data?.data || response.data;
}

export async function returnEvaluation(id: number, reason: string): Promise<EvaluationDetail> {
  const response = await apiClient.post<any>(`/api/v2/evaluations/${id}/return`, { reason });
  return response.data?.data || response.data;
}

// ── Final Reports API ──

export async function generateFinalReport(internId: number): Promise<FinalReportDetail> {
  const response = await apiClient.post<any>('/api/v2/final-reports', { internId });
  return response.data?.data || response.data;
}

export async function fetchFinalReport(internId: number): Promise<FinalReportDetail> {
  const response = await apiClient.get<any>(`/api/v2/final-reports/intern/${internId}`);
  return response.data?.data || response.data;
}

export async function approveFinalReport(reportId: number, comment?: string): Promise<FinalReportDetail> {
  const response = await apiClient.post<any>(`/api/v2/final-reports/${reportId}/approve`, { comment });
  return response.data?.data || response.data;
}
