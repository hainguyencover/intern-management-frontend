import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from '../store/departmentStore';
import { DepartmentFacade } from '../services/departmentFacade';
import { departmentSchema } from '../validation/departmentValidation';
import type { Department } from '../models/department';

export function useDepartment() {
  const store = useDepartmentStore();
  const { items, total, page, limit, search, statusFilter, loading, error, activeItem } = storeToRefs(store);

  // Dialog controls
  const showFormDialog = ref(false);
  const showDeleteDialog = ref(false);
  const formLoading = ref(false);

  // Form fields
  const formCode = ref('');
  const formName = ref('');
  const formDescription = ref('');
  const formStatus = ref<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Form Errors
  const codeError = ref<string | undefined>(undefined);
  const nameError = ref<string | undefined>(undefined);

  onMounted(() => {
    store.fetchList();
  });

  function openCreateModal() {
    store.setActiveItem(null);
    formCode.value = '';
    formName.value = '';
    formDescription.value = '';
    formStatus.value = 'ACTIVE';
    codeError.value = undefined;
    nameError.value = undefined;
    showFormDialog.value = true;
  }

  function openEditModal(item: Department) {
    store.setActiveItem(item);
    formCode.value = item.code;
    formName.value = item.name;
    formDescription.value = item.description || '';
    formStatus.value = item.status;
    codeError.value = undefined;
    nameError.value = undefined;
    showFormDialog.value = true;
  }

  function openDeleteModal(item: Department) {
    store.setActiveItem(item);
    showDeleteDialog.value = true;
  }

  async function handleSave() {
    codeError.value = undefined;
    nameError.value = undefined;

    const result = departmentSchema.safeParse({
      code: formCode.value,
      name: formName.value,
      description: formDescription.value
    });

    if (!result.success) {
      const formatted = result.error.format();
      codeError.value = formatted.code?._errors[0];
      nameError.value = formatted.name?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      if (activeItem.value) {
        await DepartmentFacade.updateDepartment(activeItem.value.id, {
          name: formName.value,
          description: formDescription.value,
          status: formStatus.value
        });
      } else {
        await DepartmentFacade.createDepartment({
          code: formCode.value,
          name: formName.value,
          description: formDescription.value
        });
      }
      showFormDialog.value = false;
      store.fetchList();
    } finally {
      formLoading.value = false;
    }
  }

  async function handleDeleteConfirm() {
    if (!activeItem.value) return;
    formLoading.value = true;
    try {
      await DepartmentFacade.deleteDepartment(activeItem.value.id);
      showDeleteDialog.value = false;
      store.fetchList();
    } finally {
      formLoading.value = false;
    }
  }

  return {
    items,
    total,
    page,
    limit,
    search,
    statusFilter,
    loading,
    error,
    activeItem,
    showFormDialog,
    showDeleteDialog,
    formLoading,
    formCode,
    formName,
    formDescription,
    formStatus,
    codeError,
    nameError,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    handleSave,
    handleDeleteConfirm,
    onSearch: (val: string) => store.setSearch(val),
    onPageChange: (val: number) => store.setPage(val),
    onStatusFilterChange: (val: string) => store.setStatusFilter(val)
  };
}
