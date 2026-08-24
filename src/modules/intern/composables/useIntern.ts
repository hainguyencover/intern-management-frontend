import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import { useInternStore } from '../store/internStore';
import { InternFacade } from '../services/internFacade';
import { internProfileSchema } from '../validation/internValidation';
import type { InternProfile } from '../models/intern';

export function useIntern() {
  const route = useRoute();
  const router = useRouter();
  const store = useInternStore();
  const {
    items,
    totalElements,
    totalPages,
    page,
    limit,
    search,
    statusFilter,
    universityFilter,
    majorFilter,
    loading,
    error,
    activeIntern
  } = storeToRefs(store);

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
  const formStatus = ref<string>('DRAFT');
  const formStartDate = ref('');
  const formEndDate = ref('');

  // Errors
  const nameError = ref<string | undefined>(undefined);
  const emailError = ref<string | undefined>(undefined);
  const phoneError = ref<string | undefined>(undefined);

  // Clean initial mount: fetch all records directly without any pre-existing query filters
  onMounted(() => {
    store.search = '';
    store.statusFilter = '';
    store.universityFilter = '';
    store.majorFilter = '';
    store.page = 1;
    store.fetchList();
  });

  // Sync state changes back to URL query parameters
  watch([page, search, statusFilter, universityFilter, majorFilter], () => {
    const query: Record<string, any> = {};
    if (page.value > 1) query.page = page.value;
    if (search.value) query.search = search.value;
    if (statusFilter.value) query.status = statusFilter.value;
    if (universityFilter.value) query.university = universityFilter.value;
    if (majorFilter.value) query.major = majorFilter.value;

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
    formStatus.value = 'DRAFT';
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
    formPhone.value = item.phone || '';
    formUniversity.value = item.university;
    formMajor.value = item.major;
    formGpa.value = item.gpa;
    formStatus.value = item.status;
    formStartDate.value = item.startDate || '';
    formEndDate.value = item.endDate || '';
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
      
      const firstMsg = formatted.fullName?._errors[0] ||
                       formatted.email?._errors[0] ||
                       formatted.university?._errors[0] ||
                       formatted.major?._errors[0] ||
                       'Vui lòng điền đầy đủ các thông tin bắt buộc.';
      Notify.create({ type: 'warning', message: firstMsg });
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
          status: formStatus.value as any,
          startDate: formStartDate.value,
          endDate: formEndDate.value
        });
        Notify.create({ type: 'positive', message: 'Cập nhật hồ sơ thực tập sinh thành công!' });
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
        Notify.create({ type: 'positive', message: 'Tạo mới hồ sơ thực tập sinh thành công!' });
      }
      showFormDialog.value = false;
      store.fetchList();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi lưu hồ sơ.';
      Notify.create({ type: 'negative', message: errMsg, timeout: 5000 });
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
      Notify.create({ type: 'positive', message: 'Xóa hồ sơ thực tập sinh thành công!' });
      store.fetchList();
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Không thể xóa hồ sơ thực tập sinh này.';
      Notify.create({ type: 'negative', message: errMsg, timeout: 5000 });
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
    universityFilter,
    majorFilter,
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
    onLimitChange: (val: number) => store.setLimit(val),
    onStatusFilterChange: (val: string) => store.setStatusFilter(val),
    onUniversityFilterChange: (val: string) => store.setUniversityFilter(val),
    onMajorFilterChange: (val: string) => store.setMajorFilter(val),
    onClearAllFilters: () => store.clearAllFilters()
  };
}
