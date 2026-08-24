<template>
  <form @submit.prevent="$emit('submit')">
    <div class="q-gutter-y-md">
      <BaseInput
        :model-value="email"
        label="Email công ty"
        placeholder="name@holaho.vn"
        :error="emailError"
        type="text"
        @update:model-value="$emit('update:email', $event)"
      />

      <BaseInput
        :model-value="password"
        label="Mật khẩu"
        placeholder="••••••••"
        :error="passwordError"
        type="password"
        @update:model-value="$emit('update:password', $event)"
      />

      <div class="row items-center justify-between q-mt-sm">
        <BaseCheckbox
          :model-value="rememberMe"
          label="Ghi nhớ đăng nhập"
          @update:model-value="$emit('update:rememberMe', $event)"
        />
        <router-link to="/auth/forgot-password" class="text-primary text-bold text-caption">
          Quên mật khẩu?
        </router-link>
      </div>

      <!-- General error banner -->
      <q-banner v-if="generalError" dense class="bg-negative text-white rounded-borders q-mt-sm">
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        {{ generalError }}
      </q-banner>

      <!-- Quick Demo Account Selector -->
      <div class="q-mt-md q-pa-sm bg-grey-2 rounded-borders">
        <div class="text-caption text-grey-8 text-bold q-mb-xs">Tài khoản thử nghiệm nhanh theo vai trò:</div>
        <div class="row q-gutter-xs">
          <q-btn size="sm" outline color="purple" label="ADMIN" @click="selectDemo('admin@company.com', 'admin123')" />
          <q-btn size="sm" outline color="primary" label="HR MANAGER" @click="selectDemo('hr@company.com', 'hr123')" />
          <q-btn size="sm" outline color="teal" label="MENTOR" @click="selectDemo('mentor1@company.com', 'mentor123')" />
          <q-btn size="sm" outline color="orange-9" label="INTERN" @click="selectDemo('intern@student.com', 'intern123')" />
        </div>
      </div>

      <BaseButton
        label="Đăng nhập"
        color="primary"
        :loading="loading"
        block
        class="q-mt-md"
        @click="$emit('submit')"
      />

      <div class="text-center q-mt-lg">
        <span class="text-grey-7">Bạn là ứng viên chưa có tài khoản? </span>
        <router-link to="/register" class="text-primary text-bold cursor-pointer" style="text-decoration: none">
          Đăng ký ngay
        </router-link>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BaseCheckbox from '../../../shared/components/BaseCheckbox.vue';

defineProps<{
  email: string;
  password: string;
  rememberMe: boolean;
  loading: boolean;
  emailError?: string;
  passwordError?: string;
  generalError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:email', value: string): void;
  (e: 'update:password', value: string): void;
  (e: 'update:rememberMe', value: boolean): void;
  (e: 'submit'): void;
}>();

function selectDemo(emailVal: string, passVal: string) {
  emit('update:email', emailVal);
  emit('update:password', passVal);
}
</script>
