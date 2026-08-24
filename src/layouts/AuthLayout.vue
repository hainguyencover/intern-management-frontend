<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout bg-grey-2">
    <q-page-container class="flex flex-center min-h-screen">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Auth Layout Shell
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.auth-layout {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
</style>
