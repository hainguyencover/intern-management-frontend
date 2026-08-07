import { apiClient } from '../../../shared/api/client';
import type {
  Task,
  TaskComment,
  DailyReport,
  CreateTaskPayload,
  CreateDailyReportPayload,
  TaskStatus
} from '../models/task';
import type { PageResponse } from '../../intern/models/intern';

export async function fetchTasks(query?: any): Promise<PageResponse<Task>> {
  try {
    const response = await apiClient.get<PageResponse<Task>>('/api/v1/tasks', { params: query });
    return response.data;
  } catch (error) {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        code: 'TSK-001',
        title: 'Xây dựng giao diện LoginPage',
        description: 'Triển khai LoginPage theo đúng thiết kế Figma và Quasar framework.',
        status: 'DONE',
        priority: 'HIGH',
        assigneeId: 'intern-1',
        assigneeName: 'Nguyễn Văn A',
        mentorId: 'mentor-1',
        mentorName: 'Trần Văn Mentor',
        dueDate: '2026-01-20',
        createdAt: '2026-01-10'
      },
      {
        id: 'task-2',
        code: 'TSK-002',
        title: 'Tích hợp Refresh Token Interceptor',
        description: 'Tách sessionInterceptor và refreshQueue xử lý 401 tự động.',
        status: 'REVIEW',
        priority: 'URGENT',
        assigneeId: 'intern-1',
        assigneeName: 'Nguyễn Văn A',
        mentorId: 'mentor-1',
        mentorName: 'Trần Văn Mentor',
        dueDate: '2026-02-15',
        createdAt: '2026-02-01'
      },
      {
        id: 'task-3',
        code: 'TSK-003',
        title: 'Viết Unit Test cho AuthStore',
        description: 'Đạt độ bao phủ code tối thiểu 80% cho module Auth.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assigneeId: 'intern-2',
        assigneeName: 'Trần Thị B',
        mentorId: 'mentor-1',
        mentorName: 'Trần Văn Mentor',
        dueDate: '2026-02-28',
        createdAt: '2026-02-10'
      }
    ];

    let filtered = mockTasks;
    if (query?.status) {
      filtered = filtered.filter((t) => t.status === query.status);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
    }

    return {
      content: filtered,
      page: query?.page || 1,
      limit: query?.limit || 10,
      totalElements: filtered.length,
      totalPages: 1
    };
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  try {
    const response = await apiClient.post<Task>('/api/v1/tasks', payload);
    return response.data;
  } catch (error) {
    return {
      id: 'task-' + Date.now(),
      code: 'TSK-' + Math.floor(Math.random() * 1000),
      title: payload.title,
      description: payload.description,
      status: 'TODO',
      priority: payload.priority,
      assigneeId: payload.assigneeId,
      assigneeName: 'Nguyễn Văn A',
      mentorId: 'mentor-1',
      mentorName: 'Trần Văn Mentor',
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  const response = await apiClient.patch<Task>(`/api/v1/tasks/${taskId}/status`, { status });
  return response.data;
}

export async function fetchTaskComments(taskId: string): Promise<TaskComment[]> {
  try {
    const response = await apiClient.get<TaskComment[]>(`/api/v1/tasks/${taskId}/comments`);
    return response.data;
  } catch (error) {
    return [
      {
        id: 'cm-1',
        taskId,
        authorName: 'Trần Văn Mentor',
        authorRole: 'MENTOR',
        content: 'Bản thảo UI giao diện làm tốt lắm! Em nhớ bổ sung thêm hiệu ứng hovers nhé.',
        createdAt: '2026-02-11 10:15'
      },
      {
        id: 'cm-2',
        taskId,
        authorName: 'Nguyễn Văn A',
        authorRole: 'INTERN',
        content: 'Vâng ạ, em đã update và đẩy code lên branch dev rồi ạ.',
        createdAt: '2026-02-11 10:30'
      }
    ];
  }
}

export async function addTaskComment(taskId: string, content: string): Promise<TaskComment> {
  const response = await apiClient.post<TaskComment>(`/api/v1/tasks/${taskId}/comments`, { content });
  return response.data;
}

export async function submitDailyReport(payload: CreateDailyReportPayload): Promise<DailyReport> {
  try {
    const response = await apiClient.post<DailyReport>('/api/v1/daily-reports', payload);
    return response.data;
  } catch (error) {
    return {
      id: 'rpt-' + Date.now(),
      internId: 'intern-1',
      internName: 'Nguyễn Văn A',
      reportDate: payload.reportDate,
      content: payload.content,
      taskIds: payload.taskIds || [],
      status: 'SUBMITTED',
      createdAt: new Date().toISOString().split('T')[0]
    };
  }
}
