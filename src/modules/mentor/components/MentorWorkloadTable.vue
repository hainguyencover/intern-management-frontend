<template>
  <q-card flat bordered class="shadow-1">
    <!-- Filter Header -->
    <q-card-section class="q-pb-none">
      <div class="row q-col-gutter-sm items-center">
        <!-- Search Input -->
        <div class="col-12 col-sm-4 col-md-4">
          <q-input
            v-model="searchKeyword"
            dense
            outlined
            placeholder="Tìm kiếm theo tên mentor, mã NV, email..."
            clearable
            @update:model-value="onFilterChange"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Workload Status Filter -->
        <div class="col-12 col-sm-4 col-md-3">
          <q-select
            v-model="selectedStatus"
            dense
            outlined
            emit-value
            map-options
            :options="statusOptions"
            label="Lọc theo trạng thái tải"
            clearable
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- Sort Option -->
        <div class="col-12 col-sm-4 col-md-3">
          <q-select
            v-model="selectedSort"
            dense
            outlined
            emit-value
            map-options
            :options="sortOptions"
            label="Sắp xếp"
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- Reset Filters -->
        <div class="col-12 col-sm-4 col-md-2 text-right">
          <q-btn
            label="Làm mới"
            icon="refresh"
            outline
            color="primary"
            dense
            class="full-width q-py-xs"
            @click="resetFilters"
          />
        </div>
      </div>
    </q-card-section>

    <!-- Data Table -->
    <q-card-section class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="mentorId"
        :loading="loading"
        flat
        bordered
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Mentor info column -->
        <template #body-cell-mentorName="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar color="primary" text-color="white" size="32px" class="q-mr-sm">
                {{ props.row.mentorName ? props.row.mentorName.charAt(0) : 'M' }}
              </q-avatar>
              <div>
                <div class="text-weight-bold text-primary cursor-pointer" @click="$emit('select-mentor', props.row)">
                  {{ props.row.mentorName }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ props.row.employeeCode }} <span v-if="props.row.email">| {{ props.row.email }}</span>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Department column -->
        <template #body-cell-departmentName="props">
          <q-td :props="props">
            <q-chip size="xs" color="grey-3" text-color="grey-9">
              {{ props.row.departmentName || 'Chưa phân bổ' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Workload Count & Progress Bar Column -->
        <template #body-cell-workloadProgress="props">
          <q-td :props="props" style="min-width: 180px;">
            <div class="row justify-between items-center text-caption q-mb-xs">
              <span class="text-weight-medium">
                {{ props.row.currentInternCount }} / {{ props.row.maxInternCapacity }} TTS
              </span>
              <span
                class="text-weight-bold"
                :class="props.row.utilizationPercent > 100 ? 'text-negative' : 'text-grey-8'"
              >
                {{ props.row.utilizationPercent }}%
              </span>
            </div>
            <q-linear-progress
              :value="Math.min(props.row.utilizationPercent / 100, 1)"
              :color="getProgressColor(props.row.utilizationPercent)"
              size="8px"
              rounded
            />
          </q-td>
        </template>

        <!-- Workload Status Badge Column -->
        <template #body-cell-workloadStatus="props">
          <q-td :props="props">
            <MentorWorkloadStatusBadge :status="props.row.workloadStatus" />
          </q-td>
        </template>

        <!-- Actions Column -->
        <template #body-cell-actions="props">
          <q-td :props="props" align="center">
            <q-btn
              label="Xem TTS"
              icon="visibility"
              size="sm"
              color="primary"
              flat
              dense
              @click="$emit('select-mentor', props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MentorWorkload, MentorWorkloadStatus } from '../types/mentorWorkload';
import MentorWorkloadStatusBadge from './MentorWorkloadStatusBadge.vue';

const props = defineProps<{
  rows: MentorWorkload[];
  loading: boolean;
  totalElements: number;
}>();

const emit = defineEmits<{
  (e: 'filter-change', filters: { keyword: string; workloadStatus: MentorWorkloadStatus | null; sort: string }): void;
  (e: 'select-mentor', mentor: MentorWorkload): void;
  (e: 'request', page: number, size: number): void;
}>();

const searchKeyword = ref('');
const selectedStatus = ref<MentorWorkloadStatus | null>(null);
const selectedSort = ref('overload_desc');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: props.totalElements,
});

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Chưa phân công', value: 'NO_ASSIGNMENT' },
  { label: 'Thiếu tải (≤60%)', value: 'UNDERLOAD' },
  { label: 'Bình thường (61-80%)', value: 'NORMAL' },
  { label: 'Gần đầy tải (81-100%)', value: 'NEAR_CAPACITY' },
  { label: 'Quá tải (>100%)', value: 'OVERLOAD' },
];

const sortOptions = [
  { label: 'Quá tải lên đầu', value: 'overload_desc' },
  { label: 'Số TTS giảm dần', value: 'count_desc' },
  { label: 'Tên Mentor A-Z', value: 'name_asc' },
];

const columns = [
  { name: 'mentorName', label: 'Mentor', field: 'mentorName', align: 'left', sortable: true },
  { name: 'departmentName', label: 'Phòng ban', field: 'departmentName', align: 'left', sortable: true },
  { name: 'workloadProgress', label: 'Tải công việc (Hiện tại / Tối đa)', field: 'currentInternCount', align: 'left' },
  { name: 'workloadStatus', label: 'Trạng thái tải', field: 'workloadStatus', align: 'center', sortable: true },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' },
];

const getProgressColor = (percent: number) => {
  if (percent > 100) return 'negative';
  if (percent >= 81) return 'warning';
  if (percent >= 61) return 'positive';
  if (percent > 0) return 'blue-7';
  return 'grey-5';
};

const onFilterChange = () => {
  emit('filter-change', {
    keyword: searchKeyword.value,
    workloadStatus: selectedStatus.value,
    sort: selectedSort.value,
  });
};

const resetFilters = () => {
  searchKeyword.value = '';
  selectedStatus.value = null;
  selectedSort.value = 'overload_desc';
  onFilterChange();
};

const onRequest = (props: any) => {
  const { page, rowsPerPage } = props.pagination;
  emit('request', page - 1, rowsPerPage);
};
</script>
