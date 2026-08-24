<template>
  <div 
    class="notification-item q-pa-md cursor-pointer transition-generic"
    :class="{ 'bg-blue-1 font-weight-medium': isUnread, 'bg-white': !isUnread }"
    @click="handleClick"
  >
    <div class="row items-start no-wrap q-gutter-x-sm">
      <div class="col-auto">
        <q-avatar :color="getIconColor(notification.type)" text-color="white" size="36px">
          <q-icon :name="getIconName(notification.type)" />
        </q-avatar>
      </div>

      <div class="col">
        <div class="row items-center justify-between">
          <div class="text-subtitle2 text-weight-bold text-dark ellipsis-2-lines">
            {{ notification.title }}
          </div>
          <span class="text-caption text-grey-6 q-ml-xs">
            {{ formatTime(notification.createdAt) }}
          </span>
        </div>

        <div class="text-body2 text-grey-8 q-mt-xs text-wrap break-word">
          {{ notification.message }}
        </div>

        <div v-if="notification.referenceType" class="q-mt-xs">
          <q-chip dense size="xs" color="primary" outline icon="near_me">
            {{ notification.referenceType }} #{{ notification.referenceId }}
          </q-chip>
        </div>
      </div>

      <div class="col-auto flex flex-center" style="height: 100%">
        <span v-if="isUnread" class="unread-dot bg-primary rounded-circle" title="Chưa đọc"></span>
        <q-btn
          flat
          round
          dense
          icon="close"
          color="grey-6"
          size="sm"
          @click.stop="handleDelete"
          title="Xóa thông báo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notificationStore';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const store = useNotificationStore();

const isUnread = computed(() => props.notification.status === 'UNREAD');

const getIconName = (type) => {
  switch (type) {
    case 'MEETING_CREATED': return 'event';
    case 'MEETING_UPDATED': return 'edit_calendar';
    case 'MEETING_CANCELLED': return 'event_busy';
    case 'MEETING_REMINDER': return 'alarm';
    case 'CONTRACT': return 'description';
    case 'APPLICATION': return 'assignment';
    default: return 'notifications';
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'MEETING_CREATED': return 'primary';
    case 'MEETING_UPDATED': return 'orange-8';
    case 'MEETING_CANCELLED': return 'negative';
    case 'MEETING_REMINDER': return 'teal-7';
    case 'CONTRACT': return 'indigo-7';
    default: return 'blue-7';
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
};

const handleClick = async () => {
  if (isUnread.value) {
    await store.markAsRead(props.notification.id);
  }
  
  // Deep-link routing based on referenceType
  if (props.notification.referenceType === 'MEETING' && props.notification.referenceId) {
    router.push({ path: `/meetings/${props.notification.referenceId}` }).catch(() => {});
  } else if (props.notification.referenceType === 'CONTRACT' && props.notification.referenceId) {
    router.push({ path: `/contracts/${props.notification.referenceId}` }).catch(() => {});
  }
};

const handleDelete = () => {
  store.deleteNotification(props.notification.id);
};
</script>

<style scoped>
.notification-item {
  border-bottom: 1px solid #edf2f7;
}
.notification-item:hover {
  background-color: #f7fafc !important;
}
.unread-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.transition-generic {
  transition: all 0.2s ease-in-out;
}
</style>
