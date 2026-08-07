<template>
  <q-layout view="lHh Lpr lFf">
    <AppSplash v-if="authStore.status === AuthStatus.INITIALIZING" />
    <router-view v-else />
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './modules/auth/store/authStore';
import { AuthStatus } from './modules/auth/constants/authEvents';
import AppSplash from './modules/auth/components/AppSplash.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth();
});
</script>
