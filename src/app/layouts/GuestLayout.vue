<template>
  <q-layout view="lHh Lpr lFf" class="guest-layout">
    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="guest-footer text-center q-py-md text-grey-5 text-caption">
      © {{ currentYear }} HoLaHo Inc. · Intern Management System v1.0.0
    </footer>
  </q-layout>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="sass">
.guest-layout
  min-height: 100vh
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

.guest-footer
  position: fixed
  bottom: 0
  left: 0
  right: 0
</style>
