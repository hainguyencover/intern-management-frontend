import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEvaluationStore } from '../store/evaluationStore';
import { EvaluationFacade } from '../services/evaluationFacade';
import { calculateEvaluationResult } from '../services/evaluationScoreEngine';
import { evaluationSchema } from '../validation/evaluationValidation';
import type { Evaluation, EvaluationStatus, EvaluationCriterion } from '../models/evaluation';

export function useEvaluation() {
  const store = useEvaluationStore();
  const { items, totalPages, page, limit, statusFilter, loading, error, activeEvaluation } = storeToRefs(store);

  const showFormDialog = ref(false);
  const formLoading = ref(false);

  // Form fields
  const formInternId = ref('');
  const formPeriod = ref('Tháng 02/2026');
  const formFeedback = ref('');
  const internError = ref<string | undefined>(undefined);

  // Default Criteria for Scoring Engine
  const criteria = ref<EvaluationCriterion[]>([
    { id: 'c1', name: 'Kiến thức kỹ thuật (Technical)', category: 'TECHNICAL', weight: 0.4, score: 8 },
    { id: 'c2', name: 'Kỹ năng mềm & Giao tiếp (Soft Skill)', category: 'SOFT_SKILL', weight: 0.3, score: 8 },
    { id: 'c3', name: 'Chuyên cần & Đúng giờ (Attendance)', category: 'ATTENDANCE', weight: 0.2, score: 9 },
    { id: 'c4', name: 'Thái độ học hỏi (Learning)', category: 'LEARNING', weight: 0.1, score: 9 }
  ]);

  // Computed Live Score Result from Score Engine
  const calculatedResult = computed(() => {
    return calculateEvaluationResult(criteria.value);
  });

  onMounted(() => {
    store.fetchEvaluations();
  });

  function openCreateModal() {
    formInternId.value = 'intern-1';
    formPeriod.value = 'Tháng 02/2026';
    formFeedback.value = '';
    internError.value = undefined;
    showFormDialog.value = true;
  }

  async function handleCreateEvaluation() {
    internError.value = undefined;
    const result = evaluationSchema.safeParse({
      internId: formInternId.value,
      period: formPeriod.value,
      feedback: formFeedback.value
    });

    if (!result.success) {
      internError.value = result.error.format().internId?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      await EvaluationFacade.createEvaluation({
        internId: formInternId.value,
        period: formPeriod.value,
        criteria: criteria.value.map((c) => ({ id: c.id, score: c.score })),
        feedback: formFeedback.value
      });
      showFormDialog.value = false;
      store.fetchEvaluations();
    } finally {
      formLoading.value = false;
    }
  }

  async function handleStatusChange(evaluation: Evaluation, targetStatus: EvaluationStatus) {
    const originalStatus = evaluation.status;
    // Optimistic Update
    evaluation.status = targetStatus;
    try {
      await EvaluationFacade.updateStatus(evaluation.id, originalStatus, targetStatus);
    } catch (err: any) {
      // Rollback
      evaluation.status = originalStatus;
      alert(err.message || 'Không thể thay đổi trạng thái phê duyệt.');
    }
  }

  return {
    items,
    totalPages,
    page,
    limit,
    statusFilter,
    loading,
    error,
    activeEvaluation,
    showFormDialog,
    formLoading,
    formInternId,
    formPeriod,
    formFeedback,
    internError,
    criteria,
    calculatedResult,
    openCreateModal,
    handleCreateEvaluation,
    handleStatusChange,
    onPageChange: (val: number) => store.setPage(val),
    onStatusFilterChange: (val: EvaluationStatus | '') => store.setStatusFilter(val)
  };
}
