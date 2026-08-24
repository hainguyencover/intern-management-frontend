export type EvaluationStatus = 'DRAFT' | 'SUBMITTED' | 'HR_REVIEWING' | 'RETURNED' | 'APPROVED' | 'LOCKED';

export interface EvaluationItem {
  id: number;
  criterionId: number;
  criterionName: string;
  category: 'TECHNICAL' | 'SOFT_SKILL' | 'ATTENDANCE' | 'LEARNING';
  score: number;
  comment?: string;
  weight: number;
  maxScore: number;
  displayOrder: number;
}

export interface EvaluationDetail {
  id: number;
  internId: number;
  internName: string;
  studentCode: string;
  mentorId: number;
  mentorName: string;
  programId?: number;
  programName?: string;
  templateId?: number;
  templateName?: string;
  period: string;
  status: EvaluationStatus;
  overallScore?: number;
  classification?: string;
  overallComment?: string;
  items: EvaluationItem[];
  taskCompletion?: number;
  attendanceRate?: number;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  lockedAt?: string;
  returnedAt?: string;
  returnReason?: string;
}

export interface PendingEvaluation {
  internId: number;
  internName: string;
  studentCode: string;
  programName?: string;
  taskCompletion: number;
  attendanceRate: number;
  evaluationStatus: string;
  draftEvaluationId?: number;
}

export interface CreateDraftPayload {
  internId: number;
  templateId: number;
  period: string;
}

export interface UpdateDraftPayload {
  criteria: { criterionId: number; score: number; comment?: string }[];
  overallComment?: string;
}

export interface FinalReportDetail {
  id: number;
  reportNumber: string;
  internId: number;
  internName: string;
  studentCode: string;
  email: string;
  mentorId?: number;
  mentorName?: string;
  programId?: number;
  programName?: string;
  status: string;
  evaluationScore: number;
  taskScore: number;
  attendanceScore: number;
  weeklyReportScore: number;
  finalScore: number;
  classification: string;
  taskTotal: number;
  taskCompleted: number;
  taskCompletionRate: number;
  attendanceTotal: number;
  attendancePresent: number;
  attendanceRate: number;
  mentorComment?: string;
  hrComment?: string;
  returnReason?: string;
  generatedAt?: string;
  approvedAt?: string;
}
