<template>
  <q-card class="auth-card shadow-10 rounded-borders text-grey-9 q-pa-md">
    <q-card-section class="text-center">
      <q-avatar size="64px" color="teal" text-color="white" icon="vpn_key" class="q-mb-sm" />
      <div class="text-h5 text-weight-bold color-teal">Đặt lại Mật khẩu</div>
      <div class="text-caption text-grey-7">Tạo mật khẩu mới cho tài khoản của bạn</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div>
          <q-input
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            :type="showNew ? 'text' : 'password'"
            label="Mật khẩu mới"
            outlined
            dense
            :error="!!errors.newPassword"
            :error-message="errors.newPassword"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showNew ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNew = !showNew"
              />
            </template>
          </q-input>
        </div>

        <div>
          <q-input
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            :type="showConfirm ? 'text' : 'password'"
            label="Xác nhận mật khẩu mới"
            outlined
            dense
            :error="!!errors.confirmPassword"
            :error-message="errors.confirmPassword"
          >
            <template #prepend>
              <q-icon name="lock_clock" />
            </template>
            <template #append>
              <q-icon
                :name="showConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </q-input>
        </div>

        <q-btn
          type="submit"
          color="teal-8"
          class="full-width q-mt-md text-weight-bold"
          size="lg"
          unelevated
          :loading="loading"
          label="Cập nhật Mật khẩu"
        />
      </q-form>

      <div class="text-center q-mt-md">
        <q-btn flat dense color="grey-7" label="Quay lại Đăng nhập" to="/auth/login" icon="arrow_back" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify } from 'quasar';
import { resetPasswordSchema } from '@/schemas/auth.schema';
import authService from '@/services/auth/authService';

const showNew = ref(false);
const showConfirm = ref(false);
const loading = ref(false);

const route = useRoute();
const router = useRouter();

const { errors, defineField, handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema)
});

const [newPassword, newPasswordAttrs] = defineField('newPassword');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

onMounted(() => {
  const token = route.query.token as string;
  if (token) {
    setFieldValue('token', token);
  } else {
    Notify.create({
      type: 'warning',
      message: 'Mã xác thực không tìm thấy trong liên kết!'
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await authService.resetPassword(values);
    Notify.create({
      type: 'positive',
      message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.'
    });
    router.push('/auth/login');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn!'
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
.color-teal {
  color: #00695c;
}
</style>
