import type { RouteRecordRaw } from 'vue-router';
import { Permissions } from '../../shared/constants/permissions';

export const evaluationRoutes: RouteRecordRaw[] = [
  {
    path: 'evaluations',
    name: 'evaluations',
    component: () => import('./pages/EvaluationListPage.vue'),
    meta: { requiresAuth: true, permission: Permissions.Evaluation.Read }
  }
];
