import apiClient from '@/services/api/apiClient';
import type { UniversityDashboardData, UniversityStudent, UniversityStudentQuery } from '@/types/university';

export async function getUniversityDashboard(): Promise<UniversityDashboardData> {
  const { data } = await apiClient.get('/university/dashboard');
  return data.data || data;
}

export async function getUniversityStudents(params?: UniversityStudentQuery): Promise<{ content: UniversityStudent[]; totalElements: number; totalPages: number }> {
  const { data } = await apiClient.get('/university/students', { params });
  return data.data || data;
}

export async function getUniversityStudentDetail(id: number): Promise<UniversityStudent> {
  const { data } = await apiClient.get(`/university/students/${id}`);
  return data.data || data;
}

export async function exportUniversityProgressReport(): Promise<Blob> {
  const response = await apiClient.get('/university/reports/progress/export', {
    responseType: 'blob'
  });
  return response.data;
}
