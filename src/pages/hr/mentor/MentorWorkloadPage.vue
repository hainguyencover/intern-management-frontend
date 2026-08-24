<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-grey-9 row items-center">
          <q-icon name="dashboard" color="primary" class="q-mr-sm" size="28px" />
          Theo dõi khối lượng Mentor
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Hệ thống hỗ trợ HR quản lý, cân bằng số lượng TTS phân công cho từng mentor và phát hiện cảnh báo quá tải.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          label="Tải lại dữ liệu"
          icon="refresh"
          color="primary"
          outline
          dense
          class="q-px-sm"
          :loading="loading"
          @click="loadAllData"
        />
      </div>
    </div>

    <!-- Summary Metrics Section -->
    <MentorWorkloadSummary :summary="summaryData" />

    <!-- Mentor Workload Table Section -->
    <MentorWorkloadTable
      :rows="workloadRows"
      :loading="loading"
      :total-elements="totalElements"
      @filter-change="handleFilterChange"
      @select-mentor="openInternDrawer"
      @request="handlePageChange"
    />

    <!-- Assigned Active Intern Drawer -->
    <MentorInternDrawer
      v-model="drawerOpen"
      :mentor="selectedMentor"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mentorWorkloadApi } from '@/modules/mentor/api/mentorWorkloadApi';
import type {
  MentorWorkload,
  MentorWorkloadSummary as MentorWorkloadSummaryType,
  MentorWorkloadStatus,
} from '@/modules/mentor/types/mentorWorkload';
import MentorWorkloadSummary from '@/modules/mentor/components/MentorWorkloadSummary.vue';
import MentorWorkloadTable from '@/modules/mentor/components/MentorWorkloadTable.vue';
import MentorInternDrawer from '@/modules/mentor/components/MentorInternDrawer.vue';

const loading = ref(false);
const summaryData = ref<MentorWorkloadSummaryType | null>(null);
const workloadRows = ref<MentorWorkload[]>([]);
const totalElements = ref(0);

const currentPage = ref(0);
const pageSize = ref(10);
const keywordFilter = ref('');
const statusFilter = ref<MentorWorkloadStatus | null>(null);
const sortFilter = ref('overload_desc');

const drawerOpen = ref(false);
const selectedMentor = ref<MentorWorkload | null>(null);

const loadSummary = async () => {
  try {
    const res = await mentorWorkloadApi.getWorkloadSummary();
    if (res.data?.success) {
      summaryData.value = res.data.data;
    }
  } catch (err) {
    console.error('Lỗi khi tải tổng quan workload:', err);
  }
};

const loadWorkloads = async () => {
  loading.value = true;
  try {
    const res = await mentorWorkloadApi.getWorkloads({
      page: currentPage.value,
      size: pageSize.value,
      keyword: keywordFilter.value || undefined,
      workloadStatus: statusFilter.value || undefined,
    });

    if (res.data?.success) {
      let content: MentorWorkload[] = res.data.data?.content || [];

      // Client-side sorting for optimal UX when requested
      if (sortFilter.value === 'overload_desc') {
        content = [...content].sort((a, b) => b.utilizationPercent - a.utilizationPercent);
      } else if (sortFilter.value === 'count_desc') {
        content = [...content].sort((a, b) => b.currentInternCount - a.currentInternCount);
      } else if (sortFilter.value === 'name_asc') {
        content = [...content].sort((a, b) => a.mentorName.localeCompare(b.mentorName));
      }

      workloadRows.value = content;
      totalElements.value = res.data.data?.totalElements || 0;
    }
  } catch (err) {
    console.error('Lỗi khi tải danh sách workload mentor:', err);
  } finally {
    loading.value = false;
  }
};

const loadAllData = () => {
  loadSummary();
  loadWorkloads();
};

const handleFilterChange = (filters: { keyword: string; workloadStatus: MentorWorkloadStatus | null; sort: string }) => {
  keywordFilter.value = filters.keyword;
  statusFilter.value = filters.workloadStatus;
  sortFilter.value = filters.sort;
  currentPage.value = 0;
  loadWorkloads();
};

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
  loadWorkloads();
};

const openInternDrawer = (mentor: MentorWorkload) => {
  selectedMentor.value = mentor;
  drawerOpen.value = true;
};

onMounted(() => {
  loadAllData();
});
</script>
