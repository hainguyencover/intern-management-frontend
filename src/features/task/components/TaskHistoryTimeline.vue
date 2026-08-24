<template>
  <div class="q-pa-md">
    <div v-if="loading" class="row justify-center q-my-md">
      <q-spinner color="primary" size="30px" />
    </div>

    <div v-else-if="!history || history.length === 0" class="text-grey-7 text-center q-my-md">
      Chưa có lịch sử cập nhật tiến độ cho nhiệm vụ này.
    </div>

    <q-timeline v-else color="secondary">
      <q-timeline-entry
        v-for="item in history"
        :key="item.id"
        :title="`Tiến độ: ${item.newProgress}%`"
        :subtitle="formatDateTime(item.changedAt)"
        :icon="getIcon(item.newStatus)"
        :color="getColor(item.newStatus)"
      >
        <div>
          <div class="text-weight-bold text-caption text-primary">
            người thực hiện: {{ item.changedByName || 'Hệ thống' }}
          </div>
          <div class="q-mt-xs text-body2" v-if="item.note">
            {{ item.note }}
          </div>
          <div class="q-mt-xs text-caption text-grey-7" v-if="item.oldStatus || item.newStatus">
            Trạng thái: 
            <q-badge color="grey-5" text-color="black" :label="item.oldStatus || 'OPEN'" />
            <q-icon name="arrow_forward" size="14px" class="q-mx-xs" />
            <TaskStatusBadge :status="item.newStatus" />
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import TaskStatusBadge from './TaskStatusBadge.vue';

defineProps({
  history: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

function formatDateTime(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getIcon(status) {
  switch (status) {
    case 'SUBMITTED': return 'send';
    case 'APPROVED': return 'check_circle';
    case 'IN_PROGRESS': return 'play_arrow';
    default: return 'edit';
  }
}

function getColor(status) {
  switch (status) {
    case 'SUBMITTED': return 'purple';
    case 'APPROVED': return 'positive';
    case 'IN_PROGRESS': return 'warning';
    default: return 'primary';
  }
}
</script>
