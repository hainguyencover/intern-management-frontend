<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 420px; max-width: 520px">
      <q-card-section class="row items-center bg-indigo-9 text-white">
        <q-icon name="security" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Cấu hình Xác thực 2 Yếu tố (2FA)</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="loadingSetup" class="column flex-center q-pa-xl">
        <q-spinner-dots size="3em" color="primary" />
        <div class="q-mt-md text-grey-7">Đang tạo mã QR 2FA...</div>
      </q-card-section>

      <q-card-section v-else class="q-pt-md">
        <div class="text-subtitle2 text-weight-medium text-grey-8 q-mb-sm">
          Bước 1: Quét mã QR bằng ứng dụng Authenticator (Google Authenticator, Authy, Microsoft Authenticator)
        </div>

        <div class="column flex-center bg-grey-2 q-pa-md rounded-borders q-mb-md">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="2FA QR Code" style="max-width: 180px; height: auto" />
          <div v-else class="text-caption text-grey-6 q-my-md">[QR Code Placeholder]</div>

          <div class="text-caption text-grey-7 q-mt-xs">Hoặc nhập thủ công mã Secret:</div>
          <q-chip clickable color="indigo-1" text-color="indigo-10" class="text-weight-bold" @click="copySecret">
            {{ secretKey }}
            <q-tooltip>Click để sao chép</q-tooltip>
          </q-chip>
        </div>

        <div class="text-subtitle2 text-weight-medium text-grey-8 q-mb-sm">
          Bước 2: Nhập mã 6 chữ số từ ứng dụng xác thực để kích hoạt
        </div>

        <q-form @submit.prevent="onVerify" class="q-gutter-md">
          <q-input
            v-model="code"
            v-bind="codeAttrs"
            label="Mã xác thực 6 chữ số"
            outlined
            dense
            mask="######"
            placeholder="123456"
            :error="!!errors.code"
            :error-message="errors.code"
          >
            <template #prepend>
              <q-icon name="pin" />
            </template>
          </q-input>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy bỏ" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              label="Kích hoạt 2FA"
              color="indigo-9"
              unelevated
              :loading="loadingVerify"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify, copyToClipboard } from 'quasar';
import { twoFactorSchema } from '@/schemas/auth.schema';
import authService from '@/services/auth/authService';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const secretKey = ref('');
const qrCodeUrl = ref('');
const loadingSetup = ref(false);
const loadingVerify = ref(false);

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(twoFactorSchema)
});

const [code, codeAttrs] = defineField('code');

const onShow = async () => {
  loadingSetup.value = true;
  try {
    const data = await authService.setup2FA();
    secretKey.value = data.secretKey;
    qrCodeUrl.value = data.qrCodeUrl;
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: 'Không thể tạo mã cấu hình 2FA. Vui lòng thử lại sau.'
    });
    emit('update:modelValue', false);
  } finally {
    loadingSetup.value = false;
  }
};

const copySecret = () => {
  if (secretKey.value) {
    copyToClipboard(secretKey.value);
    Notify.create({ type: 'positive', message: 'Đã sao chép mã Secret Key!' });
  }
};

const onVerify = handleSubmit(async (values) => {
  loadingVerify.value = true;
  try {
    await authService.verify2FA({
      code: values.code,
      secretKey: secretKey.value
    });
    Notify.create({
      type: 'positive',
      message: 'Bảo mật 2 yếu tố (2FA) đã được kích hoạt thành công!'
    });
    resetForm();
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại!';
    Notify.create({
      type: 'negative',
      message: msg
    });
  } finally {
    loadingVerify.value = false;
  }
});
</script>
