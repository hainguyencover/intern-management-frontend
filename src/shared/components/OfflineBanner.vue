<template>
  <q-banner v-if="!isOnline" class="bg-warning text-white font-weight-bold text-center z-max fixed-top">
    <template v-slot:avatar>
      <q-icon name="wifi_off" color="white" />
    </template>
    Mất kết nối mạng! Vui lòng kiểm tra lại đường truyền internet của bạn.
  </q-banner>
</template>

<script setup lang="ts">
import { useNetworkStatus } from '../composables/useNetworkStatus';

const { isOnline } = useNetworkStatus();
</script>

<style scoped lang="sass">
.z-max
  z-index: 9999
</style>
