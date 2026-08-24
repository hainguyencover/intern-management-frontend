<template>
  <div class="program-list-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Quản lý Chương trình & Đợt Thực tập</div>
        <div class="text-caption text-grey-7">Thiết lập các đợt tuyển dụng và chỉ tiêu thực tập sinh</div>
      </div>
      <q-btn
        color="teal-8"
        icon="add_business"
        label="Tạo Đợt Tuyển dụng Mới"
        unelevated
        @click="openCreateDialog"
      />
    </div>

    <!-- Programs Table -->
    <BaseTable
      title="Danh sách Chương trình Tuyển dụng"
      :rows="programs"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-capacity="props">
        <q-td :props="props">
          <div class="row items-center">
            <span class="text-weight-bold q-mr-xs">{{ props.row.currentCount }} / {{ props.row.maxCapacity }}</span>
            <q-linear-progress
              :value="props.row.currentCount / props.row.maxCapacity"
              color="teal-8"
              size="6px"
              class="rounded-borders style-progress"
            />
          </div>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.value)">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round dense icon="edit" color="primary" @click="openEditDialog(props.row)">
            <q-tooltip>Sửa thông tin chương trình</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <ProgramFormDialog
      v-model="showProgramDialog"
      :program-to-edit="programToEdit"
      @success="loadPrograms"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Program } from '@/types/program';
import type { QTableProps } from 'quasar';
import programService from '@/services/program/programService';
import BaseTable from '@/components/table/BaseTable.vue';
import ProgramFormDialog from '@/components/program/ProgramFormDialog.vue';

const programs = ref<Program[]>([]);
const loading = ref(false);
const showProgramDialog = ref(false);
const programToEdit = ref<Program | null>(null);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns: QTableProps['columns'] = [
  { name: 'code', label: 'Mã Chương trình', field: 'code', align: 'left', sortable: true },
  { name: 'name', label: 'Tên Chương trình', field: 'name', align: 'left', sortable: true },
  { name: 'startDate', label: 'Ngày bắt đầu', field: 'startDate', align: 'center' },
  { name: 'endDate', label: 'Ngày kết thúc', field: 'endDate', align: 'center' },
  { name: 'capacity', label: 'Chỉ tiêu Đã tuyển', field: 'capacity', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadPrograms();
});

const loadPrograms = async () => {
  loading.value = true;
  try {
    const res = await programService.getPrograms({
      page: pagination.value.page - 1,
      size: pagination.value.rowsPerPage
    });
    programs.value = res.content || mockPrograms;
    pagination.value.rowsNumber = res.totalElements || mockPrograms.length;
  } catch (error) {
    programs.value = mockPrograms;
    pagination.value.rowsNumber = mockPrograms.length;
  } finally {
    loading.value = false;
  }
};

const onRequest = (props: any) => {
  pagination.value.page = props.pagination.page;
  pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  loadPrograms();
};

const openCreateDialog = () => {
  programToEdit.value = null;
  showProgramDialog.value = true;
};

const openEditDialog = (prog: Program) => {
  programToEdit.value = prog;
  showProgramDialog.value = true;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'positive';
    case 'CLOSED':
      return 'grey';
    case 'DRAFT':
      return 'amber-9';
    default:
      return 'grey';
  }
};

const mockPrograms: Program[] = [
  { id: 1, code: 'INT-2026-Q3', name: 'Chương trình Thực tập Mùa Thu 2026', description: 'Đợt thực tập dành cho SV năm cuối các ngành CNTT', startDate: '2026-07-01', endDate: '2026-09-30', maxCapacity: 50, currentCount: 38, status: 'ACTIVE', createdAt: '2026-06-01' },
  { id: 2, code: 'INT-2026-Q2', name: 'Chương trình Thực tập Mùa Hè 2026', description: 'Đợt thực tập Hè cho SV Bách Khoa & QG', startDate: '2026-04-01', endDate: '2026-06-30', maxCapacity: 40, currentCount: 40, status: 'CLOSED', createdAt: '2026-03-01' }
];
</script>

<style scoped>
.style-progress {
  width: 100px;
}
</style>
