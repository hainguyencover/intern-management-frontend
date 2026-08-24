<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h5 class="text-h5 text-weight-bold text-primary q-my-none">Nhiệm vụ của tôi</h5>
        <div class="text-caption text-grey-7">Danh sách công việc được Mentor phân công và cập nhật tiến độ</div>
      </div>
      <q-badge color="primary" class="q-pa-sm text-subtitle2">
        Tổng số: {{ taskStore.totalElements }} nhiệm vụ
      </q-badge>
    </div>

    <!-- Filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-6">
          <q-select
            v-model="taskStore.filters.status"
            :options="statusOptions"
            emit-value
            map-options
            outlined
            dense
            clearable
            label="Trạng thái nhiệm vụ"
            @update:model-value="onFilterChange"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="taskStore.filters.keyword"
            outlined
            dense
            clearable
            placeholder="Tìm kiếm nhiệm vụ..."
            @keyup.enter="onFilterChange"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="onFilterChange" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- List -->
    <div v-if="taskStore.loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!taskStore.tasks || taskStore.tasks.length === 0" class="text-center q-pa-xl bg-white rounded-borders">
      <q-icon name="task_alt" size="64px" color="positive" />
      <div class="text-h6 text-grey-7 q-mt-sm">Không có nhiệm vụ nào</div>
      <div class="text-caption text-grey-6">Bạn chưa có nhiệm vụ được giao hoặc đã hoàn thành tất cả!</div>
    </div>

    <div v-else>
      <div class="row q-col-gutter-md">
        <div v-for="task in taskStore.tasks" :key="task.id" class="col-12 col-md-6 col-lg-4">
          <TaskCard
            :task="task"
            :is-intern="true"
            @update-progress="openProgressDialog"
            @history="showHistory"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="taskStore.totalPages > 1" class="row justify-center q-mt-lg">
        <q-pagination
          v-model="currentPageDisplay"
          :max="taskStore.totalPages"
          direction-links
          boundary-links
          :max-pages="7"
          color="primary"
          active-color="primary"
          @update:model-value="onPageChange"
        />
      </div>
      <div class="text-center text-caption text-grey-6 q-mt-sm" v-if="taskStore.totalElements > 0">
        Hiển thị {{ taskStore.tasks.length }} / {{ taskStore.totalElements }} nhiệm vụ
      </div>
    </div>

    <!-- Progress Dialog -->
    <TaskProgressDialog
      v-model="showProgressDialog"
      :task="activeTask"
      :submitting="taskStore.loading"
      @save="handleSaveProgress"
      @submit="handleSubmitTask"
    />

    <!-- History Dialog -->
    <q-dialog v-model="showHistoryDialog">
      <q-card style="min-width: 500px; max-width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Lịch sử cập nhật - {{ activeTask?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <TaskHistoryTimeline :history="taskStore.progressHistory" :loading="taskStore.historyLoading" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard.vue';
import TaskProgressDialog from '../components/TaskProgressDialog.vue';
import TaskHistoryTimeline from '../components/TaskHistoryTimeline.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const taskStore = useTaskStore();

const showProgressDialog = ref(false);
const showHistoryDialog = ref(false);
const activeTask = ref(null);

const statusOptions = [
  { label: 'Chưa làm (OPEN)', value: 'OPEN' },
  { label: 'Đang làm (IN_PROGRESS)', value: 'IN_PROGRESS' },
  { label: 'Đã nộp (SUBMITTED)', value: 'SUBMITTED' },
  { label: 'Cần chỉnh sửa (NEEDS_CHANGES)', value: 'NEEDS_CHANGES' },
  { label: 'Hoàn thành (APPROVED)', value: 'APPROVED' }
];

// Pagination – q-pagination is 1-based, store is 0-based
const currentPageDisplay = computed({
  get: () => taskStore.currentPage + 1,
  set: () => {}
});

onMounted(() => {
  loadTasks();
});

function loadTasks() {
  taskStore.fetchInternTasks();
}

function onFilterChange() {
  taskStore.setPage(0);
  loadTasks();
}

function onPageChange(page) {
  taskStore.setPage(page - 1);
  loadTasks();
}

function openProgressDialog(task) {
  activeTask.value = task;
  showProgressDialog.value = true;
}

function showHistory(task) {
  activeTask.value = task;
  showHistoryDialog.value = true;
  taskStore.fetchProgressHistory(task.id);
}

async function handleSaveProgress({ taskId, progressPercent, content }) {
  try {
    await taskStore.updateProgress(taskId, progressPercent, content);
    $q.notify({ type: 'positive', message: 'Cập nhật tiến độ thành công!' });
    showProgressDialog.value = false;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tiến độ' });
  }
}

async function handleSubmitTask({ taskId, note }) {
  try {
    await taskStore.submitTask(taskId, note);
    $q.notify({ type: 'positive', message: 'Đã nộp báo cáo nhiệm vụ cho Mentor!' });
    showProgressDialog.value = false;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Có lỗi xảy ra khi nộp nhiệm vụ' });
  }
}
</script>
