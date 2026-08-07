import type { RouteRecordRaw } from 'vue-router';

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: 'tasks',
    name: 'tasks',
    component: () => import('./pages/TaskListPage.vue'),
    meta: { requiresAuth: true, permission: 'task:read' }
  }
];
