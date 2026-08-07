<template>
  <q-page class="row flex-center bg-grey-2">
    <div class="col-12 col-md-6 q-pa-md">
      <BaseEmptyState
        icon="gpp_bad"
        title="403 - Access Denied"
        description="Rất tiếc, bạn không có quyền truy cập vào tài nguyên này. Vui lòng liên hệ Quản trị viên hệ thống nếu bạn nghĩ đây là một sự nhầm lẫn."
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
