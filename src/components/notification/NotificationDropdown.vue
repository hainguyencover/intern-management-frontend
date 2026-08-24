<template>
  <q-menu style="min-width: 360px; max-width: 420px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15)">
    <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
      <div class="row items-center q-gutter-x-sm">
        <span class="text-subtitle1 text-weight-bold text-dark">🔔 Thông báo</span>
        <q-badge v-if="store.unreadCount > 0" color="red-6" rounded class="q-px-xs">
          {{ store.unreadCount }}
        </q-badge>
      </div>

      <q-btn
        v-if="store.unreadCount > 0"
        flat
        dense
        size="sm"
        color="primary"
        label="Đánh dấu tất cả đã đọc"
        @click="store.markAllAsRead"
      />
    </div>

    <q-separator />

    <div style="max-height: 400px; overflow-y: auto;">
      <div v-if="store.loading" class="text-center q-pa-lg">
        <q-spinner color="primary" size="32px" />
      </div>

      <div v-else-if="store.notifications.length === 0">
        <NotificationEmpty />
      </div>

      <div v-else>
        <NotificationItem
          v-for="item in store.notifications.slice(0, 10)"
          :key="item.id"
          :notification="item"
        />
      </div>
    </div>

    <q-separator />

    <div class="q-pa-xs text-center bg-grey-1">
      <q-btn
        flat
        full-width
        color="primary"
        label="Xem tất cả thông báo"
        to="/notifications"
        v-close-popup
      />
    </div>
  </q-menu>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationItem from './NotificationItem.vue';
import NotificationEmpty from './NotificationEmpty.vue';

const store = useNotificationStore();

onMounted(() => {
  store.fetchNotifications();
  store.fetchUnreadCount();
});
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
</style>
