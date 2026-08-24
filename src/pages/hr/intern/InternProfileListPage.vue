<template>
  <div class="intern-profile-list-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Quản lý Hồ sơ Thực tập sinh</div>
        <div class="text-caption text-grey-7">Theo dõi trạng thái và quy trình thực tập sinh (State Machine)</div>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Tiếp nhận Hồ sơ Mới"
        unelevated
      />
    </div>

    <!-- Filter Bar -->
    <q-card flat bordered class="q-mb-md q-pa-sm">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-4">
          <q-input
            v-model="search"
            placeholder="Tìm theo Mã TTS, Tên, Email..."
            outlined
            dense
            clearable
            @update:model-value="onSearchChange"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-4">
          <q-select
            v-model="selectedStatus"
            :options="statusFilterOptions"
            label="Lọc theo Trạng thái State Machine"
            outlined
            dense
            clearable
            emit-value
            map-options
            @update:model-value="loadProfiles"
          />
        </div>
      </div>
    </q-card>

    <!-- Intern Profiles Table -->
    <BaseTable
      title="Danh sách Hồ sơ Thực tập sinh"
      :rows="profiles"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.value)" text-color="white" dense class="text-weight-bold">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            :to="`/hr/interns/${props.row.id}`"
          >
            <q-tooltip>Xem Chi tiết Hồ sơ</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="published_with_changes"
            color="indigo-9"
            @click="openTransitionDialog(props.row)"
          >
            <q-tooltip>Chuyển Trạng thái (State Transition)</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <!-- State Transition Dialog -->
    <StatusTransitionDialog
      v-model="showTransitionDialog"
      :profile="selectedProfile"
      @success="loadProfiles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { InternProfile, InternStatus } from '@/types/internProfile';
import type { QTableProps } from 'quasar';
import internProfileService from '@/services/intern/internProfileService';
import BaseTable from '@/components/table/BaseTable.vue';
import StatusTransitionDialog from '@/components/intern/StatusTransitionDialog.vue';

const profiles = ref<InternProfile[]>([]);
const loading = ref(false);
const search = ref('');
const selectedStatus = ref<InternStatus | null>(null);
const showTransitionDialog = ref(false);
const selectedProfile = ref<InternProfile | null>(null);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const statusFilterOptions = [
  { label: 'Tất cả Trạng thái', value: null },
  { label: 'DRAFT (Bản nháp)', value: 'DRAFT' },
  { label: 'SUBMITTED (Đã nộp)', value: 'SUBMITTED' },
  { label: 'REVIEWING (Đang xét duyệt)', value: 'REVIEWING' },
  { label: 'APPROVED (Đã phê duyệt)', value: 'APPROVED' },
  { label: 'REJECTED (Từ chối)', value: 'REJECTED' },
  { label: 'INTERNING (Đang thực tập)', value: 'INTERNING' },
  { label: 'COMPLETED (Đã hoàn thành)', value: 'COMPLETED' }
];

const columns: QTableProps['columns'] = [
  { name: 'internCode', label: 'Mã TTS', field: 'internCode', align: 'left', sortable: true },
  { name: 'fullName', label: 'Họ và Tên', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'university', label: 'Trường ĐH', field: 'university', align: 'left' },
  { name: 'mentorName', label: 'Mentor Hướng dẫn', field: 'mentorName', align: 'left' },
  { name: 'status', label: 'Trạng thái State', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadProfiles();
});

const loadProfiles = async () => {
  loading.value = true;
  try {
    const res = await internProfileService.getInternProfiles({
      page: pagination.value.page - 1,
      size: pagination.value.rowsPerPage,
      search: search.value || undefined,
      status: selectedStatus.value || undefined
    });
    profiles.value = res.content || mockProfiles;
    pagination.value.rowsNumber = res.totalElements || mockProfiles.length;
  } catch (error) {
    profiles.value = mockProfiles;
    pagination.value.rowsNumber = mockProfiles.length;
  } finally {
    loading.value = false;
  }
};

const onSearchChange = () => {
  pagination.value.page = 1;
  loadProfiles();
};

const onRequest = (props: any) => {
  pagination.value.page = props.pagination.page;
  pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  loadProfiles();
};

const openTransitionDialog = (profile: InternProfile) => {
  selectedProfile.value = profile;
  showTransitionDialog.value = true;
};

const getStatusColor = (status: InternStatus) => {
  switch (status) {
    case 'DRAFT':
      return 'grey-7';
    case 'SUBMITTED':
      return 'blue-7';
    case 'REVIEWING':
      return 'amber-9';
    case 'APPROVED':
      return 'teal-8';
    case 'REJECTED':
      return 'negative';
    case 'INTERNING':
      return 'positive';
    case 'COMPLETED':
      return 'purple-8';
    default:
      return 'grey';
  }
};

const mockProfiles: InternProfile[] = [
  { id: 1, internCode: 'INT-2026-001', fullName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0912345678', university: 'Đại học Bách Khoa', major: 'Công nghệ thông tin', gpa: 3.6, status: 'INTERNING', mentorName: 'Lê Văn Mentor', createdAt: '2026-07-01', updatedAt: '2026-08-01' },
  { id: 2, internCode: 'INT-2026-002', fullName: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0987654321', university: 'Đại học Quốc Gia', major: 'Khoa học Máy tính', gpa: 3.8, status: 'REVIEWING', mentorName: 'Chưa gán', createdAt: '2026-08-10', updatedAt: '2026-08-15' },
  { id: 3, internCode: 'INT-2026-003', fullName: 'Phạm Văn C', email: 'phamvanc@gmail.com', phone: '0933445566', university: 'Đại học Công Nghệ', major: 'Hệ thống thông tin', gpa: 3.2, status: 'SUBMITTED', mentorName: 'Chưa gán', createdAt: '2026-08-18', updatedAt: '2026-08-18' }
];
</script>
