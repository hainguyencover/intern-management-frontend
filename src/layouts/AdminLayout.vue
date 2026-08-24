<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-indigo-9 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="admin_panel_settings" size="sm" class="q-mr-xs" />
          Admin Portal - IMS
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center">
          <NotificationBell />
          <q-btn-dropdown flat no-caps color="white" icon="account_circle" :label="authStore.user?.fullName || 'Admin User'">
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup to="/admin/profile">
                <q-item-section avatar><q-icon name="person" /></q-item-section>
                <q-item-section>Hồ sơ cá nhân</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="showChangePassword = true">
                <q-item-section avatar><q-icon name="lock_reset" /></q-item-section>
                <q-item-section>Đổi mật khẩu</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout" class="text-negative">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section>Đăng xuất</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">Quản trị Hệ thống</q-item-label>

          <q-item clickable v-ripple to="/admin/dashboard" active-class="bg-indigo-1 text-indigo-9">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/users" active-class="bg-indigo-1 text-indigo-9">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Quản lý Người dùng</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/roles" active-class="bg-indigo-1 text-indigo-9">
            <q-item-section avatar><q-icon name="security" /></q-item-section>
            <q-item-section>Vai trò & Phân quyền</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/audit" active-class="bg-indigo-1 text-indigo-9">
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Nhật ký Hệ thống (Audit)</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>

    <ChangePasswordDialog v-model="showChangePassword" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import ChangePasswordDialog from '@/components/auth/ChangePasswordDialog.vue';
import NotificationBell from '@/modules/university-notifications/components/NotificationBell.vue';

const leftDrawerOpen = ref(true);
const showChangePassword = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
