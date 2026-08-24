<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="business_center" size="sm" class="q-mr-xs" />
          HR Management - IMS
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center">
          <q-btn flat round dense icon="notifications">
            <q-badge color="red" floating>3</q-badge>
          </q-btn>
          <q-btn-dropdown flat no-caps color="white" icon="badge" :label="authStore.user?.fullName || 'HR Manager'">
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup to="/hr/profile">
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
          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">HR Management</q-item-label>

          <q-item clickable v-ripple to="/hr/dashboard" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Dashboard Overview</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/interns" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="groups" /></q-item-section>
            <q-item-section>Quản lý Thực tập sinh</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/mentors" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="supervisor_account" /></q-item-section>
            <q-item-section>Quản lý Mentor</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/attendance" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="event_available" /></q-item-section>
            <q-item-section>Điểm danh & Điểm tin</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/leave" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="event_busy" /></q-item-section>
            <q-item-section>Duyệt đơn Nghỉ phép</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/allowance" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="payments" /></q-item-section>
            <q-item-section>Quản lý Phụ cấp</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/support" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="support_agent" /></q-item-section>
            <q-item-section>Yêu cầu Hỗ trợ</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/contracts" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section>Quản lý Hợp đồng</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/hr/reports" active-class="bg-blue-1 text-primary">
            <q-item-section avatar><q-icon name="assessment" /></q-item-section>
            <q-item-section>Báo cáo & Thống kê</q-item-section>
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
