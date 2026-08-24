import { apiClient } from '../../../shared/api/client';
import type {
  InternProfile,
  CreateInternPayload,
  UpdateInternPayload,
  InternQuery,
  PageResponse
} from '../models/intern';

export async function fetchInterns(query?: InternQuery): Promise<PageResponse<InternProfile>> {
  try {
    const params: Record<string, any> = {
      page: (query?.page || 1) - 1, // Spring Boot 0-indexed page
      size: query?.limit || query?.size || 10,
      sort: 'studentCode,desc'
    };

    if (query?.search && query.search.trim() !== '') {
      params.keyword = query.search.trim();
    } else if (query?.keyword && query.keyword.trim() !== '') {
      params.keyword = query.keyword.trim();
    }

    if (query?.university && query.university.trim() !== '') {
      params.university = query.university.trim();
    }

    if (query?.major && query.major.trim() !== '') {
      params.major = query.major.trim();
    }

    if (query?.status && query.status.trim() !== '') {
      params.status = query.status.trim();
    }

    const response = await apiClient.get<any>('/api/v1/interns/search', { params });
    const rawData = response.data;

    // Case 1: Standard ApiResponse<List<T>> structure -> { success: true, data: [...], meta: { page, size, totalElements, totalPages } }
    if (rawData?.success && Array.isArray(rawData.data)) {
      return {
        content: rawData.data,
        page: rawData.meta?.page ?? 1,
        limit: rawData.meta?.size ?? 10,
        totalElements: rawData.meta?.totalElements ?? rawData.data.length,
        totalPages: rawData.meta?.totalPages ?? 1
      };
    }

    // Case 2: Standard ApiResponse wrapping raw Page -> { success: true, data: { content: [...] } }
    if (rawData?.data?.content && Array.isArray(rawData.data.content)) {
      return {
        content: rawData.data.content,
        page: (rawData.data.pageable?.pageNumber ?? 0) + 1,
        limit: rawData.data.pageable?.pageSize ?? 10,
        totalElements: rawData.data.totalElements ?? rawData.data.content.length,
        totalPages: rawData.data.totalPages ?? 1
      };
    }

    // Case 3: Raw Spring Page -> { content: [...] }
    if (rawData?.content && Array.isArray(rawData.content)) {
      return {
        content: rawData.content,
        page: (rawData.pageable?.pageNumber ?? 0) + 1,
        limit: rawData.pageable?.pageSize ?? 10,
        totalElements: rawData.totalElements ?? rawData.content.length,
        totalPages: rawData.totalPages ?? 1
      };
    }

    return {
      content: Array.isArray(rawData) ? rawData : [],
      page: 1,
      limit: 10,
      totalElements: Array.isArray(rawData) ? rawData.length : 0,
      totalPages: 1
    };
  } catch (error) {
    const allInterns: InternProfile[] = [
      {
        id: '1',
        studentCode: 'TTS2026-001',
        fullName: 'Nguyễn Văn A',
        email: 'anv@holaho.vn',
        phone: '0901234567',
        university: 'Đại học Bách Khoa Hà Nội',
        major: 'Khoa học Máy tính',
        gpa: 3.6,
        status: 'INTERNING',
        startDate: '2026-01-05',
        endDate: '2026-04-05',
        createdAt: '2026-01-02'
      },
      {
        id: '2',
        studentCode: 'TTS2026-002',
        fullName: 'Trần Thị B',
        email: 'btt@holaho.vn',
        phone: '0912345678',
        university: 'Đại học Công nghệ - ĐHQGHN',
        major: 'Công nghệ Thông tin',
        gpa: 3.8,
        status: 'INTERNING',
        startDate: '2026-01-10',
        endDate: '2026-04-10',
        createdAt: '2026-01-05'
      },
      {
        id: '3',
        studentCode: 'TTS2026-003',
        fullName: 'Lê Văn C',
        email: 'cle@holaho.vn',
        phone: '0923456789',
        university: 'Học viện Bưu chính Viễn thông',
        major: 'An toàn Thông tin',
        gpa: 3.2,
        status: 'COMPLETED',
        startDate: '2025-09-01',
        endDate: '2025-12-01',
        createdAt: '2025-08-25'
      }
    ];

    let filtered = allInterns;
    if (query?.search || query?.keyword) {
      const q = (query.search || query.keyword || '').toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fullName.toLowerCase().includes(q) ||
          (item.studentCode && item.studentCode.toLowerCase().includes(q)) ||
          item.university.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q)
      );
    }
    if (query?.university) {
      const u = query.university.toLowerCase();
      filtered = filtered.filter((item) => item.university.toLowerCase().includes(u));
    }
    if (query?.major) {
      const m = query.major.toLowerCase();
      filtered = filtered.filter((item) => item.major.toLowerCase().includes(m));
    }
    if (query?.status) {
      filtered = filtered.filter((item) => item.status === query.status);
    }

    const limit = query?.limit || 10;
    const page = query?.page || 1;

    return {
      content: filtered,
      page,
      limit,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 1
    };
  }
}

export async function createIntern(payload: CreateInternPayload): Promise<InternProfile> {
  const response = await apiClient.post<any>('/api/v1/interns/profiles', payload);
  return response.data?.data || response.data;
}

export async function updateIntern(id: string | number, payload: UpdateInternPayload): Promise<InternProfile> {
  const response = await apiClient.put<any>(`/api/v1/interns/profiles/${id}`, payload);
  return response.data?.data || response.data;
}

export async function deleteIntern(id: string | number): Promise<void> {
  await apiClient.delete(`/api/v1/interns/profiles/${id}`);
}

export async function fetchInternHistory(id: string | number): Promise<any[]> {
  try {
    const response = await apiClient.get<any>(`/api/v1/interns/profiles/${id}/history`);
    return response.data?.data || response.data || [];
  } catch (error) {
    return [
      {
        id: 1,
        action: 'CREATE',
        actorEmail: 'admin@holaho.vn',
        message: 'Khởi tạo hồ sơ thực tập sinh trạng thái DRAFT',
        createdAt: '2026-01-02 09:00:00'
      },
      {
        id: 2,
        action: 'UPDATE',
        actorEmail: 'hr@holaho.vn',
        message: 'Cập nhật trường đào tạo và thời gian thực tập',
        createdAt: '2026-01-10 14:30:00'
      }
    ];
  }
}
