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

      <BaseButton
        label="Đăng nhập"
        color="primary"
        :loading="loading"
        block
        class="q-mt-lg"
        @click="$emit('submit')"
      />
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

defineEmits<{
  (e: 'update:email', value: string): void;
  (e: 'update:password', value: string): void;
  (e: 'update:rememberMe', value: boolean): void;
  (e: 'submit'): void;
}>();
</script>
