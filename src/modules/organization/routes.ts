import type { RouteRecordRaw } from 'vue-router';

export const organizationRoutes: RouteRecordRaw[] = [
  {
    path: 'departments',
    name: 'organization-departments',
    component: () => import('./pages/DepartmentListPage.vue'),
    meta: { requiresAuth: true, permission: 'dept:read' }
  }
];
