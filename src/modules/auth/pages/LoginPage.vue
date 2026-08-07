<template>
  <q-page class="row items-center justify-center" style="min-height: 100vh">
    <!-- Desktop: Hero bên trái + Form bên phải -->
    <div class="col-12 col-md-5 gt-sm column flex-center q-pa-xl">
      <AuthBranding />
    </div>

    <div class="col-12 col-md-5 q-pa-md">
      <q-card flat bordered class="login-card q-pa-xl bg-white shadow-6">
        <div class="text-h5 text-bold q-mb-xs">Đăng nhập</div>
        <div class="text-subtitle2 text-grey-6 q-mb-lg">Nhập thông tin tài khoản để bắt đầu phiên làm việc</div>

        <LoginForm
          v-model:email="email"
          v-model:password="password"
          v-model:remember-me="rememberMe"
          :loading="loading"
          :email-error="emailError"
          :password-error="passwordError"
          :general-error="generalError"
          @submit="handleLogin"
        />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AuthBranding from '../components/AuthBranding.vue';
import LoginForm from '../components/LoginForm.vue';
import { useLogin } from '../composables/useLogin';

const {
  email,
  password,
  rememberMe,
  loading,
  emailError,
  passwordError,
  generalError,
  handleLogin
} = useLogin();
</script>

<style scoped lang="sass">
.login-card
  border-radius: 16px
  max-width: 480px
  width: 100%
</style>
