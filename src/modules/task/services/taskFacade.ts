import * as taskService from './taskService';
import type {
  Task,
  TaskComment,
  DailyReport,
  CreateTaskPayload,
  CreateDailyReportPayload,
  TaskStatus
} from '../models/task';
import type { PageResponse } from '../../intern/models/intern';
import { createWorkflow } from '../../../shared/engine/workflow/workflowEngine';

export class TaskFacade {
  private static taskWorkflow = createWorkflow<TaskStatus, string>({
    id: 'TaskWorkflowEngine',
    initialState: 'TODO',
    debug: true,
    transitions: [
      { from: 'TODO', event: 'START', to: 'IN_PROGRESS' },
      { from: 'IN_PROGRESS', event: 'SUBMIT_REVIEW', to: 'REVIEW' },
      { from: 'IN_PROGRESS', event: 'CANCEL', to: 'TODO' },
      { from: 'REVIEW', event: 'APPROVE', to: 'DONE' },
      { from: 'REVIEW', event: 'REJECT', to: 'REOPENED' },
      { from: 'REVIEW', event: 'RETURN', to: 'IN_PROGRESS' },
      { from: 'DONE', event: 'REOPEN', to: 'REOPENED' },
      { from: 'REOPENED', event: 'RESUME', to: 'IN_PROGRESS' },
      { from: 'REOPENED', event: 'RESUBMIT', to: 'REVIEW' }
    ]
  });

  static isValidStatusTransition(current: TaskStatus, target: TaskStatus): boolean {
    const transitions: Record<TaskStatus, TaskStatus[]> = {
      TODO: ['IN_PROGRESS'],
      IN_PROGRESS: ['REVIEW', 'TODO'],
      REVIEW: ['DONE', 'REOPENED', 'IN_PROGRESS'],
      DONE: ['REOPENED'],
      REOPENED: ['IN_PROGRESS', 'REVIEW']
    };
    return transitions[current]?.includes(target) ?? false;
  }

  static async loadTasks(query?: any): Promise<PageResponse<Task>> {
    return await taskService.fetchTasks(query);
  }

  static async createTask(payload: CreateTaskPayload): Promise<Task> {
    return await taskService.createTask(payload);
  }

  static async updateTaskStatus(taskId: string, currentStatus: TaskStatus, targetStatus: TaskStatus): Promise<Task> {
    if (!this.isValidStatusTransition(currentStatus, targetStatus)) {
      throw new Error(`Không thể chuyển đổi trạng thái nhiệm vụ trực tiếp từ ${currentStatus} sang ${targetStatus}.`);
    }
    return await taskService.updateTaskStatus(taskId, targetStatus);
  }

  static async loadComments(taskId: string): Promise<TaskComment[]> {
    return await taskService.fetchTaskComments(taskId);
  }

  static async addComment(taskId: string, content: string): Promise<TaskComment> {
    return await taskService.addTaskComment(taskId, content);
  }

  static async submitDailyReport(payload: CreateDailyReportPayload): Promise<DailyReport> {
    return await taskService.submitDailyReport(payload);
  }

  static getWorkflowDiagram(): string {
    return this.taskWorkflow.getMermaidDiagram();
  }
}
