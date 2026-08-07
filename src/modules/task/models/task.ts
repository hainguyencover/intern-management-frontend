export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'REOPENED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  mentorId: string;
  mentorName: string;
  dueDate: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  internId: string;
  internName: string;
  reportDate: string;
  content: string;
  taskIds: string[];
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  feedback?: string;
  createdAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  priority: TaskPriority;
}

export interface CreateDailyReportPayload {
  reportDate: string;
  content: string;
  taskIds?: string[];
}
