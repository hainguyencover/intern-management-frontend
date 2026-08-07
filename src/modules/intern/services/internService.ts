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
    const response = await apiClient.get<PageResponse<InternProfile>>('/api/v1/interns', {
      params: query
    });
    return response.data;
  } catch (error) {
    const allInterns: InternProfile[] = [
      {
        id: 'intern-1',
        internCode: 'TTS2026-001',
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
        id: 'intern-2',
        internCode: 'TTS2026-002',
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
        id: 'intern-3',
        internCode: 'TTS2026-003',
        fullName: 'Lê Văn C',
        email: 'cle@holaho.vn',
        phone: '0923456789',
        university: 'Đại học Bưu chính Viễn thông',
        major: 'An toàn Thông tin',
        gpa: 3.2,
        status: 'COMPLETED',
        startDate: '2025-09-01',
        endDate: '2025-12-01',
        createdAt: '2025-08-25'
      }
    ];

    let filtered = allInterns;
    if (query?.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fullName.toLowerCase().includes(q) ||
          item.internCode.toLowerCase().includes(q) ||
          item.university.toLowerCase().includes(q)
      );
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
  const response = await apiClient.post<InternProfile>('/api/v1/interns', payload);
  return response.data;
}

export async function updateIntern(id: string, payload: UpdateInternPayload): Promise<InternProfile> {
  const response = await apiClient.put<InternProfile>(`/api/v1/interns/${id}`, payload);
  return response.data;
}

export async function deleteIntern(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/interns/${id}`);
}
