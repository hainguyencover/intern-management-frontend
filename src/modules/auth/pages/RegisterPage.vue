<template>
  <q-page class="row items-center justify-center bg-grey-1" style="min-height: 100vh">
    <div class="col-12 col-md-6 col-lg-5 q-pa-md">
      <q-card flat bordered class="register-card q-pa-lg bg-white shadow-8">
        <div class="text-center q-mb-md">
          <q-avatar size="64px" color="primary" text-color="white" icon="how_to_reg" />
          <div class="text-h5 text-bold q-mt-sm">Đăng ký tài khoản ứng viên</div>
          <div class="text-subtitle2 text-grey-7">Tạo tài khoản để nộp hồ sơ thực tập tại HoLaHo</div>
        </div>

        <q-banner v-if="errorMsg" class="bg-negative text-white q-mb-md rounded-borders">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ errorMsg }}
        </q-banner>

        <q-form @submit.prevent="handleRegister" class="q-gutter-y-md">
          <q-input
            v-model="form.fullName"
            label="Họ và tên *"
            outlined
            dense
            :rules="[val => !!val || 'Họ và tên không được để trống']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="form.email"
            label="Địa chỉ Email *"
            type="email"
            outlined
            dense
            :rules="[
              val => !!val || 'Email không được để trống',
              val => /.+@.+\..+/.test(val) || 'Email không đúng định dạng'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Mật khẩu *"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            hint="Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&#)"
            :rules="[
              val => !!val || 'Mật khẩu không được để trống',
              val => val.length >= 8 || 'Mật khẩu phải từ 8 ký tự trở lên',
              val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(val) || 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="form.confirmPassword"
            label="Xác nhận mật khẩu *"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            :rules="[
              val => !!val || 'Xác nhận mật khẩu không được để trống',
              val => val === form.password || 'Mật khẩu xác nhận không khớp'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock_reset" />
            </template>
          </q-input>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="form.university" label="Trường Đại học / Cao đẳng" outlined dense>
                <template v-slot:prepend><q-icon name="school" /></template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.major" label="Chuyên ngành" outlined dense>
                <template v-slot:prepend><q-icon name="work" /></template>
              </q-input>
            </div>
          </div>

          <q-btn
            type="submit"
            color="primary"
            label="Đăng ký tài khoản"
            class="full-width text-bold q-py-sm"
            unelevated
            :loading="loading"
          />
        </q-form>

        <div class="text-center q-mt-lg">
          <span class="text-grey-7">Đã có tài khoản? </span>
          <router-link to="/login" class="text-primary text-bold cursor-pointer" style="text-decoration: none">
            Đăng nhập ngay
          </router-link>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref('');

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  university: '',
  major: ''
});

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  errorMsg.value = '';
  loading.value = true;

  try {
    await authStore.register({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      university: form.university,
      major: form.major
    });

    router.push({
      path: '/verify-email',
      query: { email: form.email }
    });
  } catch (err: any) {
    const detailMsg = err.response?.data?.error?.details?.[0]?.message || err.response?.data?.message;
    errorMsg.value = detailMsg || err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="sass">
.register-card
  border-radius: 16px
  max-width: 520px
  margin: 0 auto
</style>
