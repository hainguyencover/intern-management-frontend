import { apiClient } from '../../../shared/api/client';
import type {
  AttendanceDetail,
  AttendanceSummary,
  CorrectionRequestPayload,
  CorrectionItem,
  LeaveRequestPayload,
  LeaveDetail
} from '../models/attendance';
import type { PageResponse } from '../../intern/models/intern';

// ── Check-in / Check-out ──

export async function checkIn(note?: string): Promise<AttendanceDetail> {
  const response = await apiClient.post<any>('/api/v2/attendance/check-in', { note, method: 'WEB' });
  return response.data?.data || response.data;
}

export async function checkOut(note?: string): Promise<AttendanceDetail> {
  const response = await apiClient.post<any>('/api/v2/attendance/check-out', { note, method: 'WEB' });
  return response.data?.data || response.data;
}

export async function fetchTodayAttendance(): Promise<AttendanceDetail | null> {
  const response = await apiClient.get<any>('/api/v2/attendance/today');
  return response.data?.data || response.data || null;
}

export async function fetchMyAttendance(query?: any): Promise<PageResponse<AttendanceDetail>> {
  const response = await apiClient.get<any>('/api/v2/attendance/me', { params: query });
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

// ── HR Attendance & Reports ──

export async function fetchAttendanceList(query?: any): Promise<PageResponse<AttendanceDetail>> {
  const response = await apiClient.get<any>('/api/v2/attendance', { params: query });
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

export async function fetchAttendanceSummary(fromDate?: string, toDate?: string): Promise<AttendanceSummary> {
  const response = await apiClient.get<any>('/api/v2/attendance/reports/summary', { params: { fromDate, toDate } });
  return response.data?.data || response.data;
}

// ── Attendance Corrections ──

export async function requestCorrection(payload: CorrectionRequestPayload): Promise<CorrectionItem> {
  const response = await apiClient.post<any>('/api/v2/attendance/corrections', payload);
  return response.data?.data || response.data;
}

export async function fetchCorrections(query?: any): Promise<PageResponse<CorrectionItem>> {
  const response = await apiClient.get<any>('/api/v2/attendance/corrections', { params: query });
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

export async function approveCorrection(id: number, comment?: string): Promise<CorrectionItem> {
  const response = await apiClient.post<any>(`/api/v2/attendance/corrections/${id}/approve`, { reviewComment: comment });
  return response.data?.data || response.data;
}

export async function rejectCorrection(id: number, comment?: string): Promise<CorrectionItem> {
  const response = await apiClient.post<any>(`/api/v2/attendance/corrections/${id}/reject`, { reviewComment: comment });
  return response.data?.data || response.data;
}

// ── Leave Requests ──

export async function createLeaveRequest(payload: LeaveRequestPayload): Promise<LeaveDetail> {
  const response = await apiClient.post<any>('/api/v2/leave-requests', payload);
  return response.data?.data || response.data;
}

export async function fetchMyLeaveRequests(): Promise<LeaveDetail[]> {
  const response = await apiClient.get<any>('/api/v2/leave-requests/me');
  return response.data?.data || response.data || [];
}

export async function fetchLeaveRequests(query?: any): Promise<PageResponse<LeaveDetail>> {
  const response = await apiClient.get<any>('/api/v2/leave-requests', { params: query });
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

export async function approveLeaveRequest(id: number): Promise<LeaveDetail> {
  const response = await apiClient.post<any>(`/api/v2/leave-requests/${id}/approve`);
  return response.data?.data || response.data;
}

export async function rejectLeaveRequest(id: number, reason?: string): Promise<LeaveDetail> {
  const response = await apiClient.post<any>(`/api/v2/leave-requests/${id}/reject`, { rejectedReason: reason });
  return response.data?.data || response.data;
}
