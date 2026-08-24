<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-bold">HoLaHo IMS</q-toolbar-title>
        <q-space />
        <div v-if="authStore.user" class="row items-center q-gutter-x-sm q-mr-sm">
          <!-- Notification Bell Icon -->
          <q-btn flat round dense icon="notifications" class="q-mr-sm">
            <q-badge v-if="unreadCount > 0" color="negative" floating rounded>{{ unreadCount }}</q-badge>
            <q-menu @show="loadNotifications" style="width: 380px; max-height: 420px">
              <q-list separator>
                <q-item-label header class="row items-center justify-between text-bold text-primary">
                  <span class="text-subtitle2"><q-icon name="notifications_active" class="q-mr-xs" />Thông báo Hệ thống</span>
                  <q-btn v-if="unreadCount > 0" flat dense size="xs" color="primary" label="Đánh dấu đã đọc tất cả" @click="markAllAsRead" />
                </q-item-label>
                <q-item v-for="note in notificationList" :key="note.id" :class="note.read ? 'bg-white' : 'bg-blue-1'">
                  <q-item-section avatar>
                    <q-avatar size="32px" :color="note.type === 'APPLICATION' ? 'primary' : 'teal'" text-color="white" :icon="note.type === 'APPLICATION' ? 'assignment_turned_in' : 'notifications'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-bold text-subtitle2">{{ note.title }}</q-item-label>
                    <q-item-label caption class="text-grey-9">{{ note.content }}</q-item-label>
                    <q-item-label caption class="text-grey-6 text-italic q-mt-xs">{{ formatDate(note.createdAt) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="notificationList.length === 0" class="text-center text-grey-6 q-pa-md">
                  <q-item-section>Chưa có thông báo mới nào</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-chip color="secondary" text-color="white" size="sm" class="text-bold">
            {{ userRoleLabel }}
          </q-chip>
          <span class="text-caption text-weight-bold">{{ authStore.user.fullName }}</span>
        </div>
        <q-btn flat round icon="logout" aria-label="Logout" @click="handleLogout">
          <q-tooltip>Đăng xuất</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">Danh mục hệ thống</q-item-label>
        <q-item
          v-for="item in menuItems"
          :key="item.to"
          clickable
          v-ripple
          :to="item.to"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useNavigation } from '../../modules/auth/composables/useNavigation';
import { apiClient as api } from '../../shared/api/client';

const router = useRouter();
const authStore = useAuthStore();
const { menuItems } = useNavigation();

const leftDrawerOpen = ref(false);
const unreadCount = ref(0);
const notificationList = ref<any[]>([]);
let pollTimer: any = null;

const userRoleLabel = computed(() => {
  if (!authStore.roles || authStore.roles.length === 0) return 'USER';
  const primaryRole = authStore.roles[0].replace('ROLE_', '');
  switch (primaryRole) {
    case 'ADMIN': return 'ADMINISTRATOR';
    case 'HR': return 'HR MANAGER';
    case 'MENTOR': return 'MENTOR';
    case 'INTERN': return 'INTERN';
    case 'READ': return 'READ ONLY';
    default: return primaryRole;
  }
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function fetchUnreadCount() {
  if (!authStore.user) return;
  try {
    const res = await api.get('/api/v1/notifications/unread-count');
    if (res.data && typeof res.data.data === 'number') {
      unreadCount.value = res.data.data;
    }
  } catch (e) {
    // Ignore error silently
  }
}

async function loadNotifications() {
  if (!authStore.user) return;
  try {
    const res = await api.get('/api/v1/notifications');
    if (res.data && res.data.data) {
      notificationList.value = res.data.data.content || res.data.data;
    }
    await fetchUnreadCount();
  } catch (e) {
    // Ignore error
  }
}

async function markAllAsRead() {
  try {
    await api.put('/api/v1/notifications/read-all');
    unreadCount.value = 0;
    notificationList.value.forEach(n => (n.read = true));
  } catch (e) {
    // Ignore
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('vi-VN');
  } catch (e) {
    return dateStr;
  }
}

async function handleLogout() {
  if (pollTimer) clearInterval(pollTimer);
  await authStore.logout();
  router.push('/auth/login');
}

onMounted(() => {
  fetchUnreadCount();
  pollTimer = setInterval(fetchUnreadCount, 15000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>
