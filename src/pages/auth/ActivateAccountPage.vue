<template>
  <div class="flex flex-center fullscreen bg-grey-2">
    <q-card style="width: 450px; max-width: 90vw;" class="shadow-3 rounded-borders">
      <q-card-section class="bg-primary text-white text-center q-pa-lg">
        <q-icon name="check_circle_outline" size="56px" />
        <div class="text-h5 text-weight-bold q-mt-sm">Kích hoạt Tài khoản</div>
        <div class="text-subtitle2 opacity-80">Thiết lập mật khẩu lần đầu cho HoLaHo IMS</div>
      </q-card-section>

      <q-card-section class="q-pa-lg q-gutter-md">
        <q-input
          v-model="token"
          label="Mã kích hoạt (Activation Token) *"
          outlined
          dense
        />
        <q-input
          v-model="password"
          label="Mật khẩu mới *"
          type="password"
          outlined
          dense
        />
        <q-input
          v-model="confirmPassword"
          label="Xác nhận mật khẩu mới *"
          type="password"
          outlined
          dense
        />
      </q-card-section>

      <q-card-actions class="q-pa-lg">
        <q-btn
          color="primary"
          class="full-width text-weight-bold"
          size="lg"
          unelevated
          label="Kích hoạt & Đăng nhập"
          :loading="loading"
          @click="handleActivate"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import apiClient from '@/services/api/apiClient';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

onMounted(() => {
  if (route.query.token) {
    token.value = String(route.query.token);
  }
});

async function handleActivate() {
  if (!token.value) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập mã kích hoạt' });
    return;
  }
  if (!password.value || password.value.length < 6) {
    $q.notify({ type: 'warning', message: 'Mật khẩu phải từ 6 ký tự trở lên' });
    return;
  }
  if (password.value !== confirmPassword.value) {
    $q.notify({ type: 'warning', message: 'Mật khẩu xác nhận không khớp' });
    return;
  }

  loading.value = true;
  try {
    await apiClient.post('/auth/activate', {
      token: token.value,
      newPassword: password.value
    });
    $q.notify({ type: 'positive', message: 'Kích hoạt tài khoản thành công! Vui lòng đăng nhập.' });
    router.push('/auth/login');
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.error?.message || 'Kích hoạt thất bại. Vui lòng kiểm tra lại token.'
    });
  } finally {
    loading.value = false;
  }
}
</script>
