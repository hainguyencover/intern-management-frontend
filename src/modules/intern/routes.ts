import type { RouteRecordRaw } from 'vue-router';

export const internRoutes: RouteRecordRaw[] = [
  {
    path: 'interns',
    name: 'interns',
    component: () => import('./pages/InternListPage.vue'),
    meta: { requiresAuth: true, permission: 'intern:read' }
  }
];
