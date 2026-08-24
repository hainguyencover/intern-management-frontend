<template>
  <q-card class="auth-card shadow-10 rounded-borders text-grey-9 q-pa-md">
    <q-card-section class="text-center">
      <q-avatar size="64px" color="indigo" text-color="white" icon="mark_email_read" class="q-mb-sm" />
      <div class="text-h5 text-weight-bold color-indigo">Quên Mật khẩu</div>
      <div class="text-caption text-grey-7">Nhập địa chỉ email đăng ký để nhận liên kết khôi phục mật khẩu</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div>
          <q-input
            v-model="email"
            v-bind="emailAttrs"
            label="Địa chỉ Email"
            outlined
            dense
            type="email"
            placeholder="example@holaho.com"
            :error="!!errors.email"
            :error-message="errors.email"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>
        </div>

        <q-btn
          type="submit"
          color="indigo-9"
          class="full-width q-mt-md text-weight-bold"
          size="lg"
          unelevated
          :loading="loading"
          label="Gửi yêu cầu Khôi phục"
        />
      </q-form>

      <div class="text-center q-mt-md">
        <q-btn flat dense color="grey-7" label="Quay lại Đăng nhập" to="/auth/login" icon="arrow_back" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify } from 'quasar';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import authService from '@/services/auth/authService';

const loading = ref(false);

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema)
});

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await authService.forgotPassword(values);
    Notify.create({
      type: 'positive',
      message: 'Liên kết khôi phục đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư!'
    });
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại!'
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  background: #ffffff;
}
.color-indigo {
  color: #1a237e;
}
</style>
