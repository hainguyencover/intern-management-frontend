<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>HoLaHo IMS</q-toolbar-title>
        <q-space />
        <q-btn flat round icon="logout" aria-label="Logout" @click="handleLogout" />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useNavigation } from '../../modules/auth/composables/useNavigation';

const router = useRouter();
const authStore = useAuthStore();
const { menuItems } = useNavigation();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function handleLogout() {
  await authStore.logout();
  router.push('/auth/login');
}
</script>
