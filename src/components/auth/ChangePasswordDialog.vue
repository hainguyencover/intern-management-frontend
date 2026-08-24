<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 400px; max-width: 500px">
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon name="lock_reset" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Đổi Mật khẩu</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-input
              v-model="currentPassword"
              v-bind="currentPasswordAttrs"
              :type="showCurrent ? 'text' : 'password'"
              label="Mật khẩu hiện tại"
              outlined
              dense
              :error="!!errors.currentPassword"
              :error-message="errors.currentPassword"
            >
              <template #append>
                <q-icon
                  :name="showCurrent ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showCurrent = !showCurrent"
                />
              </template>
            </q-input>
          </div>

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
              <template #append>
                <q-icon
                  :name="showConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showConfirm = !showConfirm"
                />
              </template>
            </q-input>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy bỏ" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              label="Cập nhật Mật khẩu"
              color="primary"
              unelevated
              :loading="loading"
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
import { Notify } from 'quasar';
import { changePasswordSchema } from '@/schemas/auth.schema';
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

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
const loading = ref(false);

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema)
});

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword');
const [newPassword, newPasswordAttrs] = defineField('newPassword');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await authService.changePassword(values);
    Notify.create({
      type: 'positive',
      message: 'Cập nhật mật khẩu thành công!'
    });
    resetForm();
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại!';
    Notify.create({
      type: 'negative',
      message: msg
    });
  } finally {
    loading.value = false;
  }
});
</script>
