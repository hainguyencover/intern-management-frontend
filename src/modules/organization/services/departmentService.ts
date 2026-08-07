import { apiClient } from '../../../shared/api/client';
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentQuery,
  DepartmentListResponse
} from '../models/department';

export async function fetchDepartments(query?: DepartmentQuery): Promise<DepartmentListResponse> {
  try {
    const response = await apiClient.get<DepartmentListResponse>('/api/v1/departments', {
      params: query
    });
    return response.data;
  } catch (error) {
    // Fallback data for early development testing
    const allItems: Department[] = [
      {
        id: 'dept-1',
        code: 'TECH',
        name: 'Phòng Phát triển Phần mềm',
        description: 'Chịu trách nhiệm nghiên cứu và phát triển phần mềm hệ thống.',
        status: 'ACTIVE',
        internCount: 54,
        createdAt: '2026-01-15'
      },
      {
        id: 'dept-2',
        code: 'QA',
        name: 'Phòng Kiểm thử Chất lượng',
        description: 'Đảm bảo chất lượng sản phẩm trước khi phát hành.',
        status: 'ACTIVE',
        internCount: 28,
        createdAt: '2026-01-20'
      },
      {
        id: 'dept-3',
        code: 'UIUX',
        name: 'Phòng Thiết kế Sản phẩm',
        description: 'Thiết kế giao diện và trải nghiệm người dùng.',
        status: 'ACTIVE',
        internCount: 22,
        createdAt: '2026-02-01'
      },
      {
        id: 'dept-4',
        code: 'HR',
        name: 'Phòng Quản trị Nhân sự',
        description: 'Quản lý công tác tuyển dụng và thực tập sinh.',
        status: 'INACTIVE',
        internCount: 0,
        createdAt: '2026-02-10'
      }
    ];

    let filtered = allItems;
    if (query?.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (item) => item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q)
      );
    }
    if (query?.status) {
      filtered = filtered.filter((item) => item.status === query.status);
    }

    return {
      items: filtered,
      total: filtered.length,
      page: query?.page || 1,
      limit: query?.limit || 10
    };
  }
}

export async function createDepartment(payload: CreateDepartmentPayload): Promise<Department> {
  const response = await apiClient.post<Department>('/api/v1/departments', payload);
  return response.data;
}

export async function updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<Department> {
  const response = await apiClient.put<Department>(`/api/v1/departments/${id}`, payload);
  return response.data;
}

export async function deleteDepartment(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/departments/${id}`);
}
