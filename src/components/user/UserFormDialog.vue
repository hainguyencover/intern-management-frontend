<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 420px; max-width: 520px">
      <q-card-section class="row items-center bg-indigo-9 text-white">
        <q-icon :name="isEdit ? 'edit' : 'person_add'" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">{{ isEdit ? 'Chỉnh sửa Người dùng' : 'Thêm mới Người dùng' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-input
              v-model="username"
              v-bind="usernameAttrs"
              label="Tên đăng nhập"
              outlined
              dense
              :disable="isEdit"
              :error="!!errors.username"
              :error-message="errors.username"
            />
          </div>

          <div>
            <q-input
              v-model="fullName"
              v-bind="fullNameAttrs"
              label="Họ và Tên"
              outlined
              dense
              :error="!!errors.fullName"
              :error-message="errors.fullName"
            />
          </div>

          <div>
            <q-input
              v-model="email"
              v-bind="emailAttrs"
              label="Địa chỉ Email"
              outlined
              dense
              type="email"
              :error="!!errors.email"
              :error-message="errors.email"
            />
          </div>

          <div v-if="!isEdit">
            <q-input
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              label="Mật khẩu ban đầu"
              outlined
              dense
              :error="!!errors.password"
              :error-message="errors.password"
            />
          </div>

          <div>
            <q-select
              v-model="role"
              v-bind="roleAttrs"
              :options="roleOptions"
              label="Vai trò (Role)"
              outlined
              dense
              emit-value
              map-options
              :error="!!errors.role"
              :error-message="errors.role"
            />
          </div>

          <div>
            <q-input
              v-model="department"
              v-bind="departmentAttrs"
              label="Phòng ban / Bộ phận"
              outlined
              dense
            />
          </div>

          <div>
            <q-input
              v-model="phone"
              v-bind="phoneAttrs"
              label="Số điện thoại"
              outlined
              dense
            />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              :label="isEdit ? 'Cập nhật' : 'Tạo mới'"
              color="indigo-9"
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
import type { User } from '@/types/auth';
import { createUserSchema, updateUserSchema } from '@/schemas/user.schema';
import userService from '@/services/user/userService';

const props = defineProps<{
  modelValue: boolean;
  userToEdit?: User | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const isEdit = computed(() => !!props.userToEdit);
const loading = ref(false);

const roleOptions = [
  { label: 'Admin (Quản trị)', value: 'ADMIN' },
  { label: 'HR (Nhân sự)', value: 'HR' },
  { label: 'Mentor (Hướng dẫn)', value: 'MENTOR' },
  { label: 'Intern (Thực tập sinh)', value: 'INTERN' }
];

const validationSchema = computed(() =>
  toTypedSchema(isEdit.value ? updateUserSchema : createUserSchema)
);

const { errors, defineField, handleSubmit, setValues, resetForm } = useForm({
  validationSchema
});

const [username, usernameAttrs] = defineField('username');
const [fullName, fullNameAttrs] = defineField('fullName');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [role, roleAttrs] = defineField('role');
const [department, departmentAttrs] = defineField('department');
const [phone, phoneAttrs] = defineField('phone');

const onShow = () => {
  if (props.userToEdit) {
    setValues({
      username: props.userToEdit.username,
      fullName: props.userToEdit.fullName,
      email: props.userToEdit.email,
      role: (props.userToEdit.role || 'INTERN') as any,
      department: props.userToEdit.department || '',
      phone: props.userToEdit.phone || ''
    });
  } else {
    resetForm();
  }
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    if (isEdit.value && props.userToEdit) {
      await userService.updateUser(props.userToEdit.id, values as any);
      Notify.create({ type: 'positive', message: 'Cập nhật người dùng thành công!' });
    } else {
      await userService.createUser(values as any);
      Notify.create({ type: 'positive', message: 'Tạo mới người dùng thành công!' });
    }
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin người dùng!'
    });
  } finally {
    loading.value = false;
  }
});
</script>
