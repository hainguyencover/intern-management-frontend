import type { RouteRecordRaw } from 'vue-router';

/**
 * Định tuyến nội bộ module Auth.
 *
 * Các route này được mount dưới prefix /auth trong GuestLayout.
 */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: { guestOnly: true }
  }
];
