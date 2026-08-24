<template>
  <q-page class="row items-center justify-center bg-grey-1" style="min-height: 100vh">
    <div class="col-12 col-md-6 col-lg-5 q-pa-md">
      <q-card flat bordered class="submitted-card q-pa-xl bg-white shadow-8 text-center">
        <q-icon name="task_alt" color="positive" size="80px" />

        <div class="text-h4 text-bold text-positive q-mt-md">Nộp hồ sơ thành công!</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Hồ sơ của bạn đã được tiếp nhận và lưu vào hệ thống ở trạng thái <q-badge color="primary" class="q-px-sm">SUBMITTED</q-badge>
        </div>

        <q-card flat bordered class="q-my-lg q-pa-md bg-grey-2 text-left rounded-borders">
          <div class="row q-col-gutter-sm">
            <div class="col-6 text-grey-7">Mã hồ sơ:</div>
            <div class="col-6 text-bold text-dark text-right">APP-{{ applicationId }}</div>

            <div class="col-6 text-grey-7">Chương trình:</div>
            <div class="col-6 text-bold text-primary text-right">{{ programName }}</div>

            <div class="col-6 text-grey-7">Email xác nhận:</div>
            <div class="col-6 text-bold text-dark text-right">{{ authStore.user?.email }}</div>
          </div>
        </q-card>

        <p class="text-caption text-grey-7">
          Một email xác nhận đã nhận hồ sơ đã được gửi đến email của bạn. Bộ phận Tuyển dụng (HR) sẽ xem xét hồ sơ và thông báo kết quả trong thời gian sớm nhất.
        </p>

        <div class="row q-gutter-sm justify-center q-mt-lg">
          <q-btn
            color="primary"
            label="Theo dõi hồ sơ của tôi"
            icon="visibility"
            unelevated
            to="/applications"
          />
          <q-btn
            flat
            color="grey-8"
            label="Về trang chủ"
            icon="home"
            to="/"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../auth/store/authStore';

const route = useRoute();
const authStore = useAuthStore();

const applicationId = computed(() => (route.query.id as string) || '0001');
const programName = computed(() => (route.query.program as string) || 'Chương trình thực tập');
</script>

<style scoped lang="sass">
.submitted-card
  border-radius: 16px
  max-width: 540px
  margin: 0 auto
</style>
