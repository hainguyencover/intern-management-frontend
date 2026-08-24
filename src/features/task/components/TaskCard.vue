<template>
  <q-card flat bordered class="task-card q-hoverable cursor-pointer" @click="$emit('click', task)">
    <q-card-section>
      <div class="row items-center justify-between no-wrap q-mb-xs">
        <div class="text-subtitle1 text-weight-bold ellipsis text-primary">{{ task.title }}</div>
        <TaskStatusBadge :status="task.status" :overdue="task.overdue" />
      </div>

      <div class="text-body2 text-grey-8 ellipsis-2-lines q-mb-sm" v-if="task.description">
        {{ task.description }}
      </div>

      <div class="row items-center q-gutter-x-sm text-caption text-grey-7 q-mb-md">
        <TaskPriorityBadge :priority="task.priority" />
        <span v-if="task.assigneeName">
          <q-icon name="person" size="14px" /> {{ task.assigneeName }}
        </span>
        <span v-if="task.dueDate">
          <q-icon name="event" size="14px" :color="task.overdue ? 'negative' : 'grey-7'" /> 
          <span :class="{'text-negative text-weight-bold': task.overdue}">
            {{ formatDate(task.dueDate) }}
          </span>
        </span>
        <span v-if="task.createdAt" class="text-grey-5">
          <q-icon name="schedule" size="14px" /> {{ formatDate(task.createdAt) }}
        </span>
      </div>

      <div class="q-mt-sm">
        <div class="row justify-between items-center text-caption text-grey-7 q-mb-xs">
          <span>Tiến độ</span>
          <span class="text-weight-bold">{{ task.progressPercent || 0 }}%</span>
        </div>
        <q-linear-progress
          :value="(task.progressPercent || 0) / 100"
          :color="getProgressColor(task.progressPercent)"
          track-color="grey-3"
          size="8px"
          rounded
        />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-px-md wrap">
      <q-btn
        flat
        dense
        size="sm"
        icon="history"
        label="Lịch sử"
        color="secondary"
        @click.stop="$emit('history', task)"
      />

      <q-btn
        v-if="isIntern && task.status !== 'APPROVED' && task.status !== 'DONE' && task.status !== 'CANCELLED'"
        unelevated
        dense
        size="sm"
        icon="edit_note"
        label="Cập nhật tiến độ"
        color="primary"
        @click.stop="$emit('update-progress', task)"
      />

      <q-btn
        v-if="isMentor && task.status !== 'APPROVED' && task.status !== 'DONE' && task.status !== 'CANCELLED'"
        flat
        dense
        size="sm"
        icon="edit"
        label="Sửa"
        color="info"
        @click.stop="$emit('edit', task)"
      />

      <q-btn
        v-if="isMentor && task.status === 'SUBMITTED'"
        unelevated
        dense
        size="sm"
        icon="check_circle"
        label="Xác nhận"
        color="positive"
        @click.stop="$emit('approve', task)"
      />

      <q-btn
        v-if="isMentor && task.status === 'SUBMITTED'"
        flat
        dense
        size="sm"
        icon="replay"
        label="Yêu cầu sửa"
        color="deep-orange"
        @click.stop="$emit('reject', task)"
      />

      <q-btn
        v-if="isMentor && task.status !== 'APPROVED' && task.status !== 'DONE' && task.status !== 'CANCELLED'"
        flat
        dense
        size="sm"
        icon="cancel"
        label="Hủy"
        color="grey-7"
        @click.stop="$emit('cancel', task)"
      />

      <q-btn
        v-if="isMentor && task.status !== 'APPROVED' && task.status !== 'DONE'"
        flat
        dense
        size="sm"
        icon="delete_outline"
        label="Xóa"
        color="negative"
        @click.stop="$emit('delete', task)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import TaskStatusBadge from './TaskStatusBadge.vue';
import TaskPriorityBadge from './TaskPriorityBadge.vue';

defineProps({
  task: {
    type: Object,
    required: true
  },
  isIntern: {
    type: Boolean,
    default: false
  },
  isMentor: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click', 'history', 'update-progress', 'approve', 'reject', 'cancel', 'edit', 'delete']);

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('vi-VN');
}

function getProgressColor(progress) {
  if (!progress || progress === 0) return 'grey-6';
  if (progress < 40) return 'orange';
  if (progress < 80) return 'blue';
  return 'positive';
}
</script>

<style scoped>
.task-card {
  transition: all 0.2s ease-in-out;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
