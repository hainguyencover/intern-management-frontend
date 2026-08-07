<template>
  <q-page class="row flex-center bg-grey-2">
    <div class="col-12 col-md-6 q-pa-md">
      <BaseEmptyState
        icon="find_in_page"
        title="404 - Page Not Found"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
        action-label="Về trang chủ"
        @action="goHome"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseEmptyState from '../../../shared/components/BaseEmptyState.vue';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>
