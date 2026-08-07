import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../validation/login';

/**
 * useLogin — Composable quản lý toàn bộ logic nghiệp vụ đăng nhập.
 *
 * Trách nhiệm:
 * - Giữ reactive state cho form (email, password, rememberMe).
 * - Validate phía client bằng Zod.
 * - Gọi authStore.login() (store → service → API).
 * - Xử lý error mapping theo HTTP status code.
 * - Redirect khi thành công.
 *
 * LoginPage chỉ việc gọi useLogin() và bind template.
 */
export function useLogin() {
  const router = useRouter();
  const authStore = useAuthStore();

  // ─── Form State ─────────────────────────────────────────
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);

  // ─── UI State ───────────────────────────────────────────
  const loading = ref(false);
  const emailError = ref<string | undefined>(undefined);
  const passwordError = ref<string | undefined>(undefined);
  const generalError = ref<string | undefined>(undefined);

  // ─── Error Mapping Matrix ──────────────────────────────
  const ERROR_MESSAGES: Record<number, string> = {
    401: 'Email hoặc mật khẩu không đúng.',
    403: 'Tài khoản không có quyền truy cập hệ thống.',
    423: 'Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau 15 phút.',
    429: 'Quá nhiều lần đăng nhập. Vui lòng đợi trước khi thử lại.',
    500: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
  };

  // ─── Actions ────────────────────────────────────────────

  function resetErrors() {
    emailError.value = undefined;
    passwordError.value = undefined;
    generalError.value = undefined;
  }

  async function handleLogin() {
    resetErrors();

    // 1. Validate phía client bằng Zod
    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value
    });

    if (!result.success) {
      const formatted = result.error.format();
      emailError.value = formatted.email?._errors[0];
      passwordError.value = formatted.password?._errors[0];
      return;
    }

    // 2. Gọi Store → Service → API
    loading.value = true;
    try {
      await authStore.login({
        email: email.value,
        password: password.value
      });

      // 3. Redirect khi thành công
      router.push('/dashboard');
    } catch (error: any) {
      const status: number = error?.status ?? 500;

      // 400: Validation errors từ Backend
      if (status === 400 && error.errors) {
        if (error.errors.email) emailError.value = error.errors.email;
        if (error.errors.password) passwordError.value = error.errors.password;
        if (!error.errors.email && !error.errors.password) {
          generalError.value = error.message || 'Dữ liệu không hợp lệ.';
        }
        return;
      }

      // Các status code đã mapping
      generalError.value = ERROR_MESSAGES[status] ?? error.message ?? ERROR_MESSAGES[500];
    } finally {
      loading.value = false;
    }
  }

  return {
    // Form state
    email,
    password,
    rememberMe,

    // UI state
    loading,
    emailError,
    passwordError,
    generalError,

    // Actions
    handleLogin
  };
}
