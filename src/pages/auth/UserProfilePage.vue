<template>
  <div class="user-profile-page" style="max-width: 800px; margin: 0 auto">
    <div class="text-h5 text-weight-bold q-mb-md">Thông tin Cá nhân & Bảo mật</div>

    <div class="row q-col-gutter-md">
      <!-- Profile Detail Card -->
      <div class="col-12 col-md-7">
        <q-card flat bordered class="fit">
          <q-card-section class="row items-center">
            <q-avatar size="64px" color="primary" text-color="white" class="q-mr-md">
              {{ authStore.user?.fullName?.charAt(0) || 'U' }}
            </q-avatar>
            <div>
              <div class="text-h6 text-weight-bold">{{ authStore.user?.fullName }}</div>
              <div class="text-caption text-grey-7">{{ authStore.user?.email }}</div>
              <q-chip color="blue-1" text-color="blue-10" dense icon="shield" class="q-mt-xs text-weight-medium">
                {{ authStore.userRole }}
              </q-chip>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-form @submit.prevent="onUpdateProfile" class="q-gutter-md">
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

              <div>
                <q-input
                  v-model="phone"
                  v-bind="phoneAttrs"
                  label="Số điện thoại"
                  outlined
                  dense
                  placeholder="0987654321"
                  :error="!!errors.phone"
                  :error-message="errors.phone"
                />
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn
                  type="submit"
                  label="Lưu Thay đổi"
                  color="primary"
                  unelevated
                  :loading="loadingUpdate"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Security Actions Card -->
      <div class="col-12 col-md-5">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Bảo mật Tài khoản</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-md">
            <!-- Password Option -->
            <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders">
              <div>
                <div class="text-weight-bold">Mật khẩu</div>
                <div class="text-caption text-grey-7">Đổi mật khẩu định kỳ để bảo vệ tài khoản</div>
              </div>
              <q-btn
                label="Đổi Mật khẩu"
                color="primary"
                outline
                dense
                size="sm"
                @click="showChangePasswordDialog = true"
              />
            </div>

            <!-- 2FA Option -->
            <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders">
              <div>
                <div class="text-weight-bold">Xác thực 2 Yếu tố (2FA)</div>
                <div class="text-caption text-grey-7">
                  {{ authStore.user?.twoFactorEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt' }}
                </div>
              </div>
              <q-btn
                :label="authStore.user?.twoFactorEnabled ? 'Cấu hình lại 2FA' : 'Kích hoạt 2FA'"
                color="indigo-9"
                outline
                dense
                size="sm"
                @click="showSetup2FADialog = true"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Security Dialog Components -->
    <ChangePasswordDialog v-model="showChangePasswordDialog" />
    <Setup2FADialog v-model="showSetup2FADialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify } from 'quasar';
import { useAuthStore } from '@/stores/auth.store';
import { updateProfileSchema } from '@/schemas/auth.schema';
import authService from '@/services/auth/authService';
import ChangePasswordDialog from '@/components/auth/ChangePasswordDialog.vue';
import Setup2FADialog from '@/components/auth/Setup2FADialog.vue';

const authStore = useAuthStore();
const loadingUpdate = ref(false);
const showChangePasswordDialog = ref(false);
const showSetup2FADialog = ref(false);

const { errors, defineField, handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(updateProfileSchema)
});

const [fullName, fullNameAttrs] = defineField('fullName');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');

onMounted(() => {
  if (authStore.user) {
    setValues({
      fullName: authStore.user.fullName || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || ''
    });
  }
});

const onUpdateProfile = handleSubmit(async (values) => {
  loadingUpdate.value = true;
  try {
    const updatedUser = await authService.updateProfile(values);
    authStore.user = updatedUser;
    localStorage.setItem('user_info', JSON.stringify(updatedUser));
    Notify.create({
      type: 'positive',
      message: 'Cập nhật thông tin cá nhân thành công!'
    });
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại!'
    });
  } finally {
    loadingUpdate.value = false;
  }
});
</script>
