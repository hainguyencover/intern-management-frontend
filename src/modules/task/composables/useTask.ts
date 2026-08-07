import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '../store/taskStore';
import { TaskFacade } from '../services/taskFacade';
import { taskSchema, dailyReportSchema } from '../validation/taskValidation';
import type { Task, TaskPriority, TaskStatus } from '../models/task';

export function useTask() {
  const store = useTaskStore();
  const { items, totalPages, page, limit, search, statusFilter, loading, error, activeTask, activeComments } = storeToRefs(store);

  // Dialog controls
  const showTaskDialog = ref(false);
  const showDetailDrawer = ref(false);
  const showReportDialog = ref(false);
  const formLoading = ref(false);

  // Task form fields
  const formTitle = ref('');
  const formDescription = ref('');
  const formAssigneeId = ref('');
  const formDueDate = ref('');
  const formPriority = ref<TaskPriority>('MEDIUM');
  const titleError = ref<string | undefined>(undefined);
  const descError = ref<string | undefined>(undefined);

  // Comment field
  const newCommentText = ref('');

  // Daily report form fields
  const formReportDate = ref(new Date().toISOString().split('T')[0]);
  const formReportContent = ref('');
  const reportError = ref<string | undefined>(undefined);

  onMounted(() => {
    store.fetchTasks();
  });

  function openCreateTaskModal() {
    formTitle.value = '';
    formDescription.value = '';
    formAssigneeId.value = 'intern-1';
    formDueDate.value = '2026-02-28';
    formPriority.value = 'MEDIUM';
    titleError.value = undefined;
    descError.value = undefined;
    showTaskDialog.value = true;
  }

  async function openTaskDetail(task: Task) {
    store.setActiveTask(task);
    newCommentText.value = '';
    showDetailDrawer.value = true;
    await store.fetchComments(task.id);
  }

  function openDailyReportModal() {
    formReportDate.value = new Date().toISOString().split('T')[0];
    formReportContent.value = '';
    reportError.value = undefined;
    showReportDialog.value = true;
  }

  async function handleCreateTask() {
    titleError.value = undefined;
    descError.value = undefined;

    const result = taskSchema.safeParse({
      title: formTitle.value,
      description: formDescription.value,
      assigneeId: formAssigneeId.value,
      dueDate: formDueDate.value,
      priority: formPriority.value
    });

    if (!result.success) {
      const formatted = result.error.format();
      titleError.value = formatted.title?._errors[0];
      descError.value = formatted.description?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      await TaskFacade.createTask({
        title: formTitle.value,
        description: formDescription.value,
        assigneeId: formAssigneeId.value,
        dueDate: formDueDate.value,
        priority: formPriority.value
      });
      showTaskDialog.value = false;
      store.fetchTasks();
    } finally {
      formLoading.value = false;
    }
  }

  async function handleStatusChange(task: Task, targetStatus: TaskStatus) {
    const originalStatus = task.status;
    // 1. Optimistic UI update
    task.status = targetStatus;
    try {
      await TaskFacade.updateTaskStatus(task.id, originalStatus, targetStatus);
    } catch (err: any) {
      // 2. Rollback on API failure
      task.status = originalStatus;
      alert(err.message || 'Không thể chuyển đổi trạng thái.');
    }
  }

  async function handleAddComment() {
    if (!activeTask.value || !newCommentText.value.trim()) return;
    try {
      await TaskFacade.addComment(activeTask.value.id, newCommentText.value.trim());
      newCommentText.value = '';
      await store.fetchComments(activeTask.value.id);
    } catch {
      // Ignore comment post error in demo
    }
  }

  async function handleSubmitDailyReport() {
    reportError.value = undefined;
    const result = dailyReportSchema.safeParse({
      reportDate: formReportDate.value,
      content: formReportContent.value
    });

    if (!result.success) {
      reportError.value = result.error.format().content?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      await TaskFacade.submitDailyReport({
        reportDate: formReportDate.value,
        content: formReportContent.value
      });
      showReportDialog.value = false;
      alert('Đã nộp báo cáo hàng ngày thành công!');
    } finally {
      formLoading.value = false;
    }
  }

  return {
    items,
    totalPages,
    page,
    limit,
    search,
    statusFilter,
    loading,
    error,
    activeTask,
    activeComments,
    showTaskDialog,
    showDetailDrawer,
    showReportDialog,
    formLoading,
    formTitle,
    formDescription,
    formAssigneeId,
    formDueDate,
    formPriority,
    titleError,
    descError,
    newCommentText,
    formReportDate,
    formReportContent,
    reportError,
    openCreateTaskModal,
    openTaskDetail,
    openDailyReportModal,
    handleCreateTask,
    handleStatusChange,
    handleAddComment,
    handleSubmitDailyReport,
    onSearch: (val: string) => store.setSearch(val),
    onPageChange: (val: number) => store.setPage(val),
    onStatusFilterChange: (val: TaskStatus | '') => store.setStatusFilter(val)
  };
}
