<template>
  <q-page class="row items-center justify-center bg-grey-1" style="min-height: 100vh">
    <div class="col-12 col-md-6 col-lg-5 q-pa-md">
      <q-card flat bordered class="verify-card q-pa-lg bg-white shadow-8 text-center">
        <div v-if="verified" class="q-py-md">
          <q-icon name="check_circle" color="positive" size="72px" />
          <div class="text-h5 text-bold q-mt-md text-positive">Email đã được xác thực thành công!</div>
          <div class="text-subtitle1 text-grey-7 q-mt-sm">
            Tài khoản của bạn đã hoàn tất xác thực. Bây giờ bạn có thể tiếp tục chọn chương trình và nộp hồ sơ ứng tuyển.
          </div>

          <q-btn
            color="primary"
            label="Tiếp tục nộp hồ sơ"
            icon="post_add"
            class="q-mt-lg text-bold q-px-lg"
            unelevated
            to="/applications/new"
          />
        </div>

        <div v-else class="q-py-md">
          <q-avatar size="64px" color="info" text-color="white" icon="mark_email_unread" />
          <div class="text-h5 text-bold q-mt-md">Xác thực địa chỉ Email</div>
          <div class="text-subtitle2 text-grey-7 q-mt-xs">
            Chúng tôi đã gửi mã xác thực tới email của bạn
            <span v-if="email" class="text-bold text-dark">: {{ email }}</span>
          </div>

          <q-banner v-if="errorMsg" class="bg-negative text-white q-mt-md rounded-borders text-left">
            <template v-slot:avatar>
              <q-icon name="error" color="white" />
            </template>
            {{ errorMsg }}
          </q-banner>

          <q-banner v-if="infoMsg" class="bg-positive text-white q-mt-md rounded-borders text-left">
            <template v-slot:avatar>
              <q-icon name="check" color="white" />
            </template>
            {{ infoMsg }}
          </q-banner>

          <q-form @submit.prevent="submitToken" class="q-mt-lg q-gutter-y-md">
            <q-input
              v-model="tokenInput"
              label="Nhập mã xác thực (Verification Token) *"
              outlined
              dense
              class="text-center"
              :rules="[val => !!val || 'Vui lòng nhập token xác thực']"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              label="Xác thực ngay"
              class="full-width text-bold q-py-sm"
              unelevated
              :loading="verifying"
            />
          </q-form>

          <div class="row items-center justify-between q-mt-lg">
            <q-btn
              flat
              dense
              color="grey-7"
              label="Chưa nhận được email? Gửi lại"
              icon="refresh"
              :loading="resending"
              @click="handleResend"
            />

            <router-link to="/login" class="text-primary text-bold" style="text-decoration: none">
              Về trang đăng nhập
            </router-link>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const route = useRoute();
const authStore = useAuthStore();

const email = ref((route.query.email as string) || authStore.user?.email || '');
const tokenInput = ref((route.query.token as string) || '');
const verifying = ref(false);
const resending = ref(false);
const verified = ref(Boolean(authStore.user?.emailVerified));
const errorMsg = ref('');
const infoMsg = ref('');

async function submitToken() {
  if (!tokenInput.value) return;

  errorMsg.value = '';
  infoMsg.value = '';
  verifying.value = true;

  try {
    await authStore.verifyEmail(tokenInput.value.trim());
    verified.value = true;
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Xác thực thất bại. Token có thể đã hết hạn.';
  } finally {
    verifying.value = false;
  }
}

async function handleResend() {
  if (!email.value) {
    errorMsg.value = 'Vui lòng nhập địa chỉ email của bạn';
    return;
  }

  errorMsg.value = '';
  infoMsg.value = '';
  resending.value = true;

  try {
    await authStore.resendVerification(email.value.trim());
    infoMsg.value = 'Đã gửi lại email xác thực thành công. Vui lòng kiểm tra hộp thư.';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Không thể gửi lại email xác thực.';
  } finally {
    resending.value = false;
  }
}

onMounted(() => {
  if (tokenInput.value && !verified.value) {
    submitToken();
  }
});
</script>

<style scoped lang="sass">
.verify-card
  border-radius: 16px
  max-width: 520px
  margin: 0 auto
</style>
