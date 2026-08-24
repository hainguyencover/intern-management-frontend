<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-teal-8 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="school" size="sm" class="q-mr-xs" />
          Mentor Portal - IMS
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center">
          <q-btn-dropdown flat no-caps color="white" icon="person" :label="authStore.user?.fullName || 'Mentor'">
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup to="/mentor/profile">
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
          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">Mentor Management</q-item-label>

          <q-item clickable v-ripple to="/mentor/dashboard" active-class="bg-teal-1 text-teal-9">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/mentor/interns" active-class="bg-teal-1 text-teal-9">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Thực tập sinh Quản lý</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/mentor/tasks" active-class="bg-teal-1 text-teal-9">
            <q-item-section avatar><q-icon name="assignment" /></q-item-section>
            <q-item-section>Giao việc & Task</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/mentor/reports" active-class="bg-teal-1 text-teal-9">
            <q-item-section avatar><q-icon name="assessment" /></q-item-section>
            <q-item-section>Duyệt Báo cáo Tuần</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/mentor/evaluations" active-class="bg-teal-1 text-teal-9">
            <q-item-section avatar><q-icon name="rate_review" /></q-item-section>
            <q-item-section>Đánh giá Thực tập sinh</q-item-section>
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
