<template>
  <q-card class="login-card shadow-10 rounded-borders text-grey-9 q-pa-md">
    <q-card-section class="text-center">
      <q-avatar size="64px" color="primary" text-color="white" icon="business" class="q-mb-sm" />
      <div class="text-h5 text-weight-bold color-primary">Intern Management</div>
      <div class="text-caption text-grey-7">Đăng nhập vào hệ thống quản lý thực tập sinh</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div>
          <q-input
            v-model="username"
            v-bind="usernameAttrs"
            label="Tên đăng nhập / Email"
            outlined
            dense
            :error="!!errors.username"
            :error-message="errors.username"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>

        <div>
          <q-input
            v-model="password"
            v-bind="passwordAttrs"
            :type="showPassword ? 'text' : 'password'"
            label="Mật khẩu"
            outlined
            dense
            :error="!!errors.password"
            :error-message="errors.password"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <div v-if="requiresTwoFactor">
          <q-input
            v-model="twoFactorCode"
            v-bind="twoFactorCodeAttrs"
            label="Mã xác thực 2FA (6 chữ số)"
            outlined
            dense
            mask="######"
            placeholder="123456"
            :error="!!errors.twoFactorCode"
            :error-message="errors.twoFactorCode"
          >
            <template #prepend>
              <q-icon name="security" />
            </template>
          </q-input>
        </div>

        <div class="row items-center justify-between">
          <q-checkbox v-model="rememberMe" label="Ghi nhớ đăng nhập" dense color="primary" />
          <q-btn flat dense color="primary" label="Quên mật khẩu?" class="text-caption" to="/auth/forgot-password" />
        </div>

        <q-btn
          type="submit"
          color="primary"
          class="full-width q-mt-md text-weight-bold"
          size="lg"
          unelevated
          :loading="loading"
          label="Đăng nhập"
        />
      </q-form>
    </q-card-section>

    <q-card-section class="text-center text-caption text-grey-6">
      © 2026 HoLaHo IMS. All rights reserved.
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify } from 'quasar';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema } from '@/schemas/auth.schema';
import authService from '@/services/auth/authService';

const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const requiresTwoFactor = ref(false);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema)
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [twoFactorCode, twoFactorCodeAttrs] = defineField('twoFactorCode');

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const data = await authService.login({
      username: values.username,
      password: values.password,
      twoFactorCode: values.twoFactorCode
    });

    if (data.requiresTwoFactor && !values.twoFactorCode) {
      requiresTwoFactor.value = true;
      Notify.create({
        type: 'info',
        message: 'Tài khoản của bạn đã bật 2FA. Vui lòng nhập mã 6 chữ số từ Authenticator!'
      });
      return;
    }

    authStore.setAuth(data);
    Notify.create({
      type: 'positive',
      message: `Đăng nhập thành công! Chào mừng ${data.user.fullName}`
    });

    const redirectPath = (route.query.redirect as string) || getDashboardRoute(data.user.role);
    router.push(redirectPath);
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
    Notify.create({
      type: 'negative',
      message: errorMsg
    });
  } finally {
    loading.value = false;
  }
});

function getDashboardRoute(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'ROLE_ADMIN':
      return '/admin/dashboard';
    case 'HR':
    case 'ROLE_HR':
      return '/hr/dashboard';
    case 'MENTOR':
    case 'ROLE_MENTOR':
      return '/mentor/dashboard';
    case 'INTERN':
    case 'ROLE_INTERN':
      return '/intern/dashboard';
    default:
      return '/auth/login';
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  background: #ffffff;
}
.color-primary {
  color: #1976d2;
}
</style>
