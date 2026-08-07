export type EvaluationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface EvaluationCriterion {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'SOFT_SKILL' | 'ATTENDANCE' | 'LEARNING';
  weight: number; // e.g., 0.4 = 40%
  score: number;  // 1 - 10
}

export interface Evaluation {
  id: string;
  internId: string;
  internName: string;
  mentorId: string;
  mentorName: string;
  period: string;
  status: EvaluationStatus;
  criteria: EvaluationCriterion[];
  weightedScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passFail: 'PASS' | 'FAIL';
  feedback?: string;
  createdAt: string;
}

export interface CreateEvaluationPayload {
  internId: string;
  period: string;
  criteria: { id: string; score: number }[];
  feedback?: string;
}
