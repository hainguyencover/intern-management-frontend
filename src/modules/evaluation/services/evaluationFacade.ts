import * as evaluationService from './evaluationService';
import type { Evaluation, CreateEvaluationPayload, EvaluationStatus } from '../models/evaluation';
import type { PageResponse } from '../../intern/models/intern';
import { createWorkflow } from '../../../shared/engine/workflow/workflowEngine';

export class EvaluationFacade {
  private static evaluationWorkflow = createWorkflow<EvaluationStatus, string>({
    id: 'EvaluationApprovalWorkflow',
    initialState: 'DRAFT',
    debug: true,
    transitions: [
      { from: 'DRAFT', event: 'SUBMIT', to: 'SUBMITTED' },
      { from: 'SUBMITTED', event: 'START_REVIEW', to: 'UNDER_REVIEW' },
      { from: 'SUBMITTED', event: 'REVERT_DRAFT', to: 'DRAFT' },
      { from: 'UNDER_REVIEW', event: 'APPROVE', to: 'APPROVED' },
      { from: 'UNDER_REVIEW', event: 'REJECT', to: 'REJECTED' },
      { from: 'REJECTED', event: 'RESTART', to: 'DRAFT' }
    ]
  });

  static isValidStatusTransition(current: EvaluationStatus, target: EvaluationStatus): boolean {
    const transitions: Record<EvaluationStatus, EvaluationStatus[]> = {
      DRAFT: ['SUBMITTED'],
      SUBMITTED: ['UNDER_REVIEW', 'DRAFT'],
      UNDER_REVIEW: ['APPROVED', 'REJECTED'],
      APPROVED: [],
      REJECTED: ['DRAFT']
    };
    return transitions[current]?.includes(target) ?? false;
  }

  static async loadEvaluations(query?: any): Promise<PageResponse<Evaluation>> {
    return await evaluationService.fetchEvaluations(query);
  }

  static async createEvaluation(payload: CreateEvaluationPayload): Promise<Evaluation> {
    return await evaluationService.createEvaluation(payload);
  }

  static async updateStatus(id: string, currentStatus: EvaluationStatus, targetStatus: EvaluationStatus): Promise<Evaluation> {
    if (!this.isValidStatusTransition(currentStatus, targetStatus)) {
      throw new Error(`Không thể chuyển đổi quy trình phê duyệt từ ${currentStatus} sang ${targetStatus}.`);
    }
    return await evaluationService.updateEvaluationStatus(id, targetStatus);
  }

  static getWorkflowDiagram(): string {
    return this.evaluationWorkflow.getMermaidDiagram();
  }
}
