<template>
  <div class="inline-block relative-position">
    <q-btn flat round dense icon="notifications" color="grey-8">
      <q-badge
        v-if="store.unreadCount > 0"
        color="negative"
        floating
        rounded
        class="text-bold"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </q-badge>

      <NotificationDropdown />
    </q-btn>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationDropdown from './NotificationDropdown.vue';

const store = useNotificationStore();

onMounted(() => {
  store.fetchUnreadCount();
});
</script>
