<template>
  <q-btn flat round dense icon="notifications" class="q-mr-sm">
    <q-badge
      v-if="store.unreadCount > 0"
      color="red"
      floating
      transparent
    >
      {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
    </q-badge>

    <q-menu anchor="bottom end" self="top end" style="min-width: 340px; max-width: 400px">
      <q-card flat class="column">
        <q-card-section class="row items-center justify-between q-py-sm bg-primary text-white">
          <div class="text-subtitle1 text-weight-bold">Thông báo Trường</div>
          <q-btn
            v-if="store.unreadCount > 0"
            flat
            dense
            size="sm"
            color="white"
            label="Đọc tất cả"
            @click="store.markAllAsRead()"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none style-scroll" style="max-height: 350px">
          <q-list separator v-if="store.items.length > 0">
            <q-item
              v-for="item in store.items.slice(0, 5)"
              :key="item.id"
              clickable
              :class="{ 'bg-blue-1': item.status === 'UNREAD' }"
              @click="handleItemClick(item)"
            >
              <q-item-section avatar>
                <q-avatar
                  :icon="item.type === 'INTERNSHIP_COMPLETED' ? 'check_circle' : 'cancel'"
                  :color="item.type === 'INTERNSHIP_COMPLETED' ? 'positive' : 'negative'"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-caption">
                  {{ item.title }}
                </q-item-label>
                <q-item-label caption lines="2">
                  {{ item.message }}
                </q-item-label>
                <q-item-label caption class="text-grey-6 text-right q-mt-xs">
                  {{ formatTime(item.createdAt) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="item.status === 'UNREAD'">
                <q-badge rounded color="blue" />
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center q-pa-md text-grey">
            <q-icon name="notifications_off" size="48px" class="q-mb-xs" />
            <div>Chưa có thông báo nào</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-py-xs">
          <q-btn
            flat
            color="primary"
            label="Xem tất cả thông báo"
            to="/university/notifications"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUniversityNotificationStore } from '../stores/useUniversityNotificationStore';
import type { UniversityNotification } from '../types/notification.types';

const store = useUniversityNotificationStore();
const router = useRouter();

onMounted(() => {
  store.fetchUnreadCount();
  store.fetchNotifications();
});

function handleItemClick(item: UniversityNotification) {
  if (item.status === 'UNREAD') {
    store.markAsRead(item.id);
  }
  if (item.referenceId) {
    router.push(`/university/students/${item.referenceId}`);
  } else {
    router.push('/university/notifications');
  }
}

function formatTime(isoStr: string) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}
</script>

<style scoped>
.style-scroll {
  overflow-y: auto;
}
</style>
