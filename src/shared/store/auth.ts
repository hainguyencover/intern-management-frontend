/**
 * Re-export từ module auth store.
 *
 * File này được giữ lại để tương thích ngược với các import cũ
 * (ví dụ: shared/composables/usePermission.ts).
 *
 * Nguồn chính thức: modules/auth/store/authStore.ts
 */
export { useAuthStore } from '../../modules/auth/store/authStore';
