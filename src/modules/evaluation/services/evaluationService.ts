import { apiClient } from '../../../shared/api/client';
import type { Evaluation, CreateEvaluationPayload, EvaluationStatus } from '../models/evaluation';
import type { PageResponse } from '../../intern/models/intern';
import { calculateEvaluationResult } from './evaluationScoreEngine';

export async function fetchEvaluations(query?: any): Promise<PageResponse<Evaluation>> {
  try {
    const response = await apiClient.get<PageResponse<Evaluation>>('/api/v1/evaluations', { params: query });
    return response.data;
  } catch (error) {
    const mockEvaluations: Evaluation[] = [
      {
        id: 'eval-1',
        internId: 'intern-1',
        internName: 'Nguyễn Văn A',
        mentorId: 'mentor-1',
        mentorName: 'Trần Văn Mentor',
        period: 'Tháng 01/2026',
        status: 'APPROVED',
        criteria: [
          { id: 'c1', name: 'Kiến thức kỹ thuật (Technical)', category: 'TECHNICAL', weight: 0.4, score: 9 },
          { id: 'c2', name: 'Kỹ năng mềm & Giao tiếp (Soft Skill)', category: 'SOFT_SKILL', weight: 0.3, score: 8 },
          { id: 'c3', name: 'Chuyên cần & Đúng giờ (Attendance)', category: 'ATTENDANCE', weight: 0.2, score: 9 },
          { id: 'c4', name: 'Thái độ học hỏi (Learning)', category: 'LEARNING', weight: 0.1, score: 9.5 }
        ],
        weightedScore: 8.8,
        grade: 'A',
        passFail: 'PASS',
        feedback: 'Thực tập sinh thể hiện tư duy lập trình xuất sắc, hoàn thành tốt nhiệm vụ được giao.',
        createdAt: '2026-01-31'
      },
      {
        id: 'eval-2',
        internId: 'intern-2',
        internName: 'Trần Thị B',
        mentorId: 'mentor-1',
        mentorName: 'Trần Văn Mentor',
        period: 'Tháng 01/2026',
        status: 'SUBMITTED',
        criteria: [
          { id: 'c1', name: 'Kiến thức kỹ thuật (Technical)', category: 'TECHNICAL', weight: 0.4, score: 7 },
          { id: 'c2', name: 'Kỹ năng mềm & Giao tiếp (Soft Skill)', category: 'SOFT_SKILL', weight: 0.3, score: 7.5 },
          { id: 'c3', name: 'Chuyên cần & Đúng giờ (Attendance)', category: 'ATTENDANCE', weight: 0.2, score: 8 },
          { id: 'c4', name: 'Thái độ học hỏi (Learning)', category: 'LEARNING', weight: 0.1, score: 8 }
        ],
        weightedScore: 7.4,
        grade: 'B',
        passFail: 'PASS',
        feedback: 'Thực tập sinh tiếp thu nhanh, cần chú ý nâng cao kỹ năng xử lý lỗi.',
        createdAt: '2026-01-31'
      }
    ];

    let filtered = mockEvaluations;
    if (query?.status) {
      filtered = filtered.filter((e) => e.status === query.status);
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

export async function createEvaluation(payload: CreateEvaluationPayload): Promise<Evaluation> {
  const defaultCriteria = [
    { id: 'c1', name: 'Kiến thức kỹ thuật (Technical)', category: 'TECHNICAL' as const, weight: 0.4, score: payload.criteria[0]?.score || 8 },
    { id: 'c2', name: 'Kỹ năng mềm & Giao tiếp (Soft Skill)', category: 'SOFT_SKILL' as const, weight: 0.3, score: payload.criteria[1]?.score || 8 },
    { id: 'c3', name: 'Chuyên cần & Đúng giờ (Attendance)', category: 'ATTENDANCE' as const, weight: 0.2, score: payload.criteria[2]?.score || 9 },
    { id: 'c4', name: 'Thái độ học hỏi (Learning)', category: 'LEARNING' as const, weight: 0.1, score: payload.criteria[3]?.score || 9 }
  ];

  const calculated = calculateEvaluationResult(defaultCriteria);

  try {
    const response = await apiClient.post<Evaluation>('/api/v1/evaluations', payload);
    return response.data;
  } catch (error) {
    return {
      id: 'eval-' + Date.now(),
      internId: payload.internId,
      internName: 'Nguyễn Văn A',
      mentorId: 'mentor-1',
      mentorName: 'Trần Văn Mentor',
      period: payload.period,
      status: 'DRAFT',
      criteria: defaultCriteria,
      weightedScore: calculated.weightedScore,
      grade: calculated.grade,
      passFail: calculated.passFail,
      feedback: payload.feedback,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }
}

export async function updateEvaluationStatus(id: string, status: EvaluationStatus): Promise<Evaluation> {
  const response = await apiClient.patch<Evaluation>(`/api/v1/evaluations/${id}/status`, { status });
  return response.data;
}
