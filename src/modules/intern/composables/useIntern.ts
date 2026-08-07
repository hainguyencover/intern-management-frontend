import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useInternStore } from '../store/internStore';
import { InternFacade } from '../services/internFacade';
import { internProfileSchema } from '../validation/internValidation';
import type { InternProfile } from '../models/intern';

export function useIntern() {
  const route = useRoute();
  const router = useRouter();
  const store = useInternStore();
  const { items, totalElements, totalPages, page, limit, search, statusFilter, loading, error, activeIntern } = storeToRefs(store);

  // Dialog controls
  const showFormDialog = ref(false);
  const showDeleteDialog = ref(false);
  const formLoading = ref(false);

  // Form fields
  const formFullName = ref('');
  const formEmail = ref('');
  const formPhone = ref('');
  const formUniversity = ref('');
  const formMajor = ref('');
  const formGpa = ref<number | undefined>(undefined);
  const formStatus = ref<'APPLIED' | 'INTERNING' | 'COMPLETED' | 'TERMINATED'>('INTERNING');
  const formStartDate = ref('');
  const formEndDate = ref('');

  // Errors
  const nameError = ref<string | undefined>(undefined);
  const emailError = ref<string | undefined>(undefined);
  const phoneError = ref<string | undefined>(undefined);

  // Read URL query params on initial mount
  onMounted(() => {
    const urlPage = route.query.page ? Number(route.query.page) : 1;
    const urlSearch = (route.query.search as string) || '';
    const urlStatus = (route.query.status as string) || '';

    store.page = urlPage;
    store.search = urlSearch;
    store.statusFilter = urlStatus;

    store.fetchList();
  });

  // Sync state changes back to URL query parameters
  watch([page, search, statusFilter], () => {
    const query: Record<string, any> = {};
    if (page.value > 1) query.page = page.value;
    if (search.value) query.search = search.value;
    if (statusFilter.value) query.status = statusFilter.value;

    router.replace({ query });
  });

  function openCreateModal() {
    store.setActiveIntern(null);
    formFullName.value = '';
    formEmail.value = '';
    formPhone.value = '';
    formUniversity.value = '';
    formMajor.value = '';
    formGpa.value = undefined;
    formStatus.value = 'INTERNING';
    formStartDate.value = '';
    formEndDate.value = '';
    nameError.value = undefined;
    emailError.value = undefined;
    phoneError.value = undefined;
    showFormDialog.value = true;
  }

  function openEditModal(item: InternProfile) {
    store.setActiveIntern(item);
    formFullName.value = item.fullName;
    formEmail.value = item.email;
    formPhone.value = item.phone;
    formUniversity.value = item.university;
    formMajor.value = item.major;
    formGpa.value = item.gpa;
    formStatus.value = item.status;
    formStartDate.value = item.startDate;
    formEndDate.value = item.endDate;
    nameError.value = undefined;
    emailError.value = undefined;
    phoneError.value = undefined;
    showFormDialog.value = true;
  }

  function openDeleteModal(item: InternProfile) {
    store.setActiveIntern(item);
    showDeleteDialog.value = true;
  }

  async function handleSave() {
    nameError.value = undefined;
    emailError.value = undefined;
    phoneError.value = undefined;

    const result = internProfileSchema.safeParse({
      fullName: formFullName.value,
      email: formEmail.value,
      phone: formPhone.value,
      university: formUniversity.value,
      major: formMajor.value,
      gpa: formGpa.value ? Number(formGpa.value) : undefined,
      startDate: formStartDate.value,
      endDate: formEndDate.value
    });

    if (!result.success) {
      const formatted = result.error.format();
      nameError.value = formatted.fullName?._errors[0];
      emailError.value = formatted.email?._errors[0];
      phoneError.value = formatted.phone?._errors[0];
      return;
    }

    formLoading.value = true;
    try {
      if (activeIntern.value) {
        await InternFacade.updateIntern(activeIntern.value.id, {
          fullName: formFullName.value,
          email: formEmail.value,
          phone: formPhone.value,
          university: formUniversity.value,
          major: formMajor.value,
          gpa: formGpa.value ? Number(formGpa.value) : undefined,
          status: formStatus.value,
          startDate: formStartDate.value,
          endDate: formEndDate.value
        });
      } else {
        await InternFacade.createIntern({
          fullName: formFullName.value,
          email: formEmail.value,
          phone: formPhone.value,
          university: formUniversity.value,
          major: formMajor.value,
          gpa: formGpa.value ? Number(formGpa.value) : undefined,
          startDate: formStartDate.value,
          endDate: formEndDate.value
        });
      }
      showFormDialog.value = false;
      store.fetchList();
    } finally {
      formLoading.value = false;
    }
  }

  async function handleDeleteConfirm() {
    if (!activeIntern.value) return;
    formLoading.value = true;
    try {
      await InternFacade.deleteIntern(activeIntern.value.id);
      showDeleteDialog.value = false;
      store.fetchList();
    } finally {
      formLoading.value = false;
    }
  }

  return {
    items,
    totalElements,
    totalPages,
    page,
    limit,
    search,
    statusFilter,
    loading,
    error,
    activeIntern,
    showFormDialog,
    showDeleteDialog,
    formLoading,
    formFullName,
    formEmail,
    formPhone,
    formUniversity,
    formMajor,
    formGpa,
    formStatus,
    formStartDate,
    formEndDate,
    nameError,
    emailError,
    phoneError,
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
