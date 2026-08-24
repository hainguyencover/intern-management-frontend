<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h5 class="text-h5 text-weight-bold text-primary q-my-none">Quản lý & Giao nhiệm vụ</h5>
        <div class="text-caption text-grey-7">Theo dõi tiến độ công việc và giao nhiệm vụ cho thực tập sinh</div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Giao nhiệm vụ"
        @click="openCreateDialog"
      />
    </div>

    <!-- Group Selector & Filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedGroupId"
            :options="groupOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            outlined
            dense
            label="Chọn nhóm thực tập"
            @update:model-value="onGroupChange"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="taskStore.filters.status"
            :options="statusOptions"
            emit-value
            map-options
            outlined
            dense
            clearable
            label="Trạng thái nhiệm vụ"
            @update:model-value="loadTasks"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="taskStore.filters.keyword"
            outlined
            dense
            clearable
            placeholder="Tìm kiếm nhiệm vụ..."
            @keyup.enter="loadTasks"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="loadTasks" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- Task List -->
    <div v-if="taskStore.loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!taskStore.tasks || taskStore.tasks.length === 0" class="text-center q-pa-xl bg-white rounded-borders">
      <q-icon name="assignment_late" size="64px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-sm">Chưa có nhiệm vụ nào</div>
      <div class="text-caption text-grey-6 q-mb-md">Nhấn "Giao nhiệm vụ" để bắt đầu phân công công việc</div>
    </div>

    <div v-else>
      <div class="row q-col-gutter-md">
        <div v-for="task in taskStore.tasks" :key="task.id" class="col-12 col-md-6 col-lg-4">
          <TaskCard
            :task="task"
            :is-mentor="true"
            @history="showHistory"
            @approve="handleApprove"
            @reject="openRejectDialog"
            @cancel="openCancelDialog"
            @edit="openEditDialog"
            @delete="confirmDelete"
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

    <!-- Create/Edit Task Dialog -->
    <TaskFormDialog
      v-model="showFormDialog"
      :group-id="effectiveGroupId"
      :interns="taskStore.groupInterns"
      :submitting="taskStore.loading"
      :edit-task="editingTask"
      @submit="handleCreateSubmit"
      @update="handleEditSubmit"
    />

    <!-- Reject Dialog -->
    <TaskRejectDialog
      v-model="showRejectDialog"
      :task="activeTask"
      :submitting="taskStore.loading"
      @confirm="handleRejectSubmit"
    />

    <!-- Cancel Dialog -->
    <TaskCancelDialog
      v-model="showCancelDialog"
      :task="activeTask"
      :submitting="taskStore.loading"
      @confirm="handleCancelSubmit"
    />

    <!-- History Dialog -->
    <q-dialog v-model="showHistoryDialog">
      <q-card style="min-width: 500px; max-width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Lịch sử tiến độ - {{ activeTask?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <TaskHistoryTimeline :history="taskStore.progressHistory" :loading="taskStore.historyLoading" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Xác nhận xóa nhiệm vụ</span>
        </q-card-section>
        <q-card-section>
          Bạn có chắc chắn muốn xóa nhiệm vụ <strong>"{{ deleteTask?.title }}"</strong>?
          <br />
          <span class="text-caption text-negative">Hành động này không thể hoàn tác.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn unelevated label="Xóa" color="negative" :loading="taskStore.loading" @click="handleDeleteConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard.vue';
import TaskFormDialog from '../components/TaskFormDialog.vue';
import TaskRejectDialog from '../components/TaskRejectDialog.vue';
import TaskCancelDialog from '../components/TaskCancelDialog.vue';
import TaskHistoryTimeline from '../components/TaskHistoryTimeline.vue';
import { useQuasar } from 'quasar';
import axiosClient from '@/api/axiosClient.js';

const $q = useQuasar();
const taskStore = useTaskStore();

const selectedGroupId = ref(null);
const groupOptions = ref([]);

const effectiveGroupId = computed(() => {
  if (selectedGroupId.value) return selectedGroupId.value;
  const firstReal = groupOptions.value.find(g => g.id !== null);
  return firstReal ? firstReal.id : 1;
});

const statusOptions = [
  { label: 'Chưa làm (OPEN)', value: 'OPEN' },
  { label: 'Đang làm (IN_PROGRESS)', value: 'IN_PROGRESS' },
  { label: 'Đã nộp (SUBMITTED)', value: 'SUBMITTED' },
  { label: 'Cần sửa (NEEDS_CHANGES)', value: 'NEEDS_CHANGES' },
  { label: 'Hoàn thành (APPROVED)', value: 'APPROVED' },
  { label: 'Đã hủy (CANCELLED)', value: 'CANCELLED' }
];

const showFormDialog = ref(false);
const showRejectDialog = ref(false);
const showCancelDialog = ref(false);
const showHistoryDialog = ref(false);
const showDeleteDialog = ref(false);
const activeTask = ref(null);
const editingTask = ref(null);
const deleteTask = ref(null);

// Pagination – q-pagination is 1-based, store is 0-based
const currentPageDisplay = computed({
  get: () => taskStore.currentPage + 1,
  set: () => {}
});

onMounted(async () => {
  await fetchGroups();
  loadTasks();
});

async function fetchGroups() {
  try {
    const res = await axiosClient.get('/api/v1/program-groups');
    const data = res.data?.data?.content || res.data?.data || res.data || [];
    const list = Array.isArray(data) ? data : [];
    
    groupOptions.value = [
      { id: null, name: 'Tất cả các nhóm' },
      ...list.map(g => ({ id: g.id, name: g.name || `Nhóm #${g.id}` }))
    ];
  } catch (err) {
    console.error('Failed to fetch program groups', err);
    groupOptions.value = [{ id: null, name: 'Tất cả các nhóm' }];
  }
}

function onGroupChange(groupId) {
  taskStore.fetchGroupInterns(groupId || effectiveGroupId.value);
  taskStore.setPage(0);
  loadTasks();
}

function onPageChange(page) {
  taskStore.setPage(page - 1); // convert 1-based to 0-based
  loadTasks();
}

function loadTasks() {
  taskStore.fetchMentorTasks(selectedGroupId.value);
}

function openCreateDialog() {
  editingTask.value = null;
  taskStore.fetchGroupInterns(effectiveGroupId.value);
  showFormDialog.value = true;
}

function openEditDialog(task) {
  editingTask.value = task;
  showFormDialog.value = true;
}

function openRejectDialog(task) {
  activeTask.value = task;
  showRejectDialog.value = true;
}

function openCancelDialog(task) {
  activeTask.value = task;
  showCancelDialog.value = true;
}

function confirmDelete(task) {
  deleteTask.value = task;
  showDeleteDialog.value = true;
}

async function handleCreateSubmit(payload) {
  try {
    await taskStore.createMentorTask(payload);
    $q.notify({ type: 'positive', message: 'Giao nhiệm vụ thành công!' });
    showFormDialog.value = false;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Có lỗi xảy ra khi giao nhiệm vụ' });
  }
}

async function handleEditSubmit(payload) {
  try {
    await taskStore.updateMentorTask(payload.taskId, {
      groupId: payload.groupId,
      internIds: payload.internIds,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      startDate: payload.startDate,
      dueDate: payload.dueDate,
      weight: payload.weight
    });
    $q.notify({ type: 'positive', message: 'Cập nhật nhiệm vụ thành công!' });
    showFormDialog.value = false;
    editingTask.value = null;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhiệm vụ' });
  }
}

async function handleDeleteConfirm() {
  try {
    await taskStore.deleteMentorTask(deleteTask.value.id);
    $q.notify({ type: 'positive', message: 'Đã xóa nhiệm vụ thành công!' });
    showDeleteDialog.value = false;
    deleteTask.value = null;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Có lỗi xảy ra khi xóa nhiệm vụ' });
  }
}

function showHistory(task) {
  activeTask.value = task;
  showHistoryDialog.value = true;
  taskStore.fetchProgressHistory(task.id);
}

async function handleApprove(task) {
  try {
    await taskStore.approveTask(task.id, 'Mentor đã xác nhận hoàn thành');
    $q.notify({ type: 'positive', message: 'Đã xác nhận hoàn thành nhiệm vụ!' });
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể phê duyệt nhiệm vụ' });
  }
}

async function handleRejectSubmit({ taskId, reason }) {
  try {
    await taskStore.rejectTask(taskId, reason);
    $q.notify({ type: 'warning', message: 'Đã gửi yêu cầu làm lại cho thực tập sinh' });
    showRejectDialog.value = false;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể gửi yêu cầu làm lại' });
  }
}

async function handleCancelSubmit({ taskId, reason }) {
  try {
    await taskStore.cancelTask(taskId, reason);
    $q.notify({ type: 'info', message: 'Đã hủy nhiệm vụ thành công' });
    showCancelDialog.value = false;
    loadTasks();
  } catch (err) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể hủy nhiệm vụ' });
  }
}
</script>
