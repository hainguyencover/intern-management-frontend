<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-blue-8 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="face" size="sm" class="q-mr-xs" />
          Intern Portal - IMS
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center">
          <q-btn-dropdown flat no-caps color="white" icon="account_box" :label="authStore.user?.fullName || 'Intern'">
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup to="/intern/profile">
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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">Trang cá nhân Thực tập sinh</q-item-label>

          <q-item clickable v-ripple to="/intern/dashboard" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Tổng quan Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/profile" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Hồ sơ cá nhân</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/attendance" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="fingerprint" /></q-item-section>
            <q-item-section>Check-in / Điểm danh</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/tasks" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="task" /></q-item-section>
            <q-item-section>Nhiệm vụ của tôi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/weekly-reports" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="note_add" /></q-item-section>
            <q-item-section>Báo cáo Tuần</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/leave" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="event_note" /></q-item-section>
            <q-item-section>Gửi đơn Nghỉ phép</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/support" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="contact_support" /></q-item-section>
            <q-item-section>Yêu cầu Hỗ trợ</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/intern/allowances" active-class="bg-blue-1 text-blue-9">
            <q-item-section avatar><q-icon name="account_balance_wallet" /></q-item-section>
            <q-item-section>Lịch sử Phụ cấp</q-item-section>
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

const leftDrawerOpen = ref(true);
const showChangePassword = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
