<template>
  <q-app>
    <router-view />
  </q-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initializeAuth();
});
</script>
