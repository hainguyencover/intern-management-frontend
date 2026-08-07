import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAssignmentStore } from '../store/assignmentStore';
import { AssignmentFacade } from '../services/assignmentFacade';
import { assignmentSchema, reassignSchema } from '../validation/assignmentValidation';
import type { InternProfile } from '../models/intern';

export function useAssignment() {
  const store = useAssignmentStore();
  const { history, capacityInfo, loading, error } = storeToRefs(store);

  const showAssignDialog = ref(false);
  const showHistoryDialog = ref(false);
  const formLoading = ref(false);
  const selectedIntern = ref<InternProfile | null>(null);

  // Form fields
  const formMentorId = ref('');
  const formDepartmentId = ref('');
  const formStartDate = ref('');
  const formEndDate = ref('');
  const formReason = ref('');

  // Errors
  const mentorError = ref<string | undefined>(undefined);
  const departmentError = ref<string | undefined>(undefined);
  const generalError = ref<string | undefined>(undefined);

  function openAssignModal(intern: InternProfile) {
    selectedIntern.value = intern;
    formMentorId.value = '';
    formDepartmentId.value = 'dept-1';
    formStartDate.value = intern.startDate || '2026-01-05';
    formEndDate.value = intern.endDate || '2026-04-05';
    formReason.value = '';
    mentorError.value = undefined;
    departmentError.value = undefined;
    generalError.value = undefined;
    showAssignDialog.value = true;
  }

  async function openHistoryModal(intern: InternProfile) {
    selectedIntern.value = intern;
    showHistoryDialog.value = true;
    await store.fetchHistory(intern.id);
  }

  async function onMentorSelected(mentorId: string) {
    formMentorId.value = mentorId;
    if (mentorId) {
      try {
        await store.checkCapacity(mentorId);
      } catch {
        // Ignore capacity check fail
      }
    }
  }

  async function handleAssignSubmit() {
    if (!selectedIntern.value) return;

    mentorError.value = undefined;
    departmentError.value = undefined;
    generalError.value = undefined;

    const result = assignmentSchema.safeParse({
      mentorId: formMentorId.value,
      departmentId: formDepartmentId.value,
      startDate: formStartDate.value,
      endDate: formEndDate.value
    });

    if (!result.success) {
      const formatted = result.error.format();
      mentorError.value = formatted.mentorId?._errors[0];
      departmentError.value = formatted.departmentId?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      await AssignmentFacade.assignIntern({
        internId: selectedIntern.value.id,
        mentorId: formMentorId.value,
        departmentId: formDepartmentId.value,
        startDate: formStartDate.value,
        endDate: formEndDate.value
      });
      showAssignDialog.value = false;
    } catch (err: any) {
      generalError.value = err?.message || 'Có lỗi xảy ra khi gán Mentor.';
    } finally {
      formLoading.value = false;
    }
  }

  return {
    showAssignDialog,
    showHistoryDialog,
    formLoading,
    selectedIntern,
    history,
    capacityInfo,
    loading,
    error,
    formMentorId,
    formDepartmentId,
    formStartDate,
    formEndDate,
    formReason,
    mentorError,
    departmentError,
    generalError,
    openAssignModal,
    openHistoryModal,
    onMentorSelected,
    handleAssignSubmit
  };
}
