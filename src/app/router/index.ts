import { createRouter, createWebHistory } from 'vue-router';
import { setupAuthGuards } from '../../modules/auth/guards/authGuards';

const routes = [
  // ─── Guest Routes (GuestLayout) ─────────────────────────
  {
    path: '/auth',
    component: () => import('../layouts/GuestLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../../modules/auth/pages/LoginPage.vue')
      }
    ]
  },

  // ─── Authenticated Routes (MainLayout) ──────────────────
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../../modules/dashboard/pages/DashboardPage.vue')
      },
      {
        path: 'design-system',
        name: 'design-system',
        component: () => import('../../modules/administration/pages/DesignSystemShowcase.vue')
      },
      {
        path: 'organization/departments',
        name: 'organization-departments',
        component: () => import('../../modules/organization/pages/DepartmentListPage.vue')
      },
      {
        path: 'interns',
        name: 'interns',
        component: () => import('../../modules/intern/pages/InternListPage.vue')
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('../../modules/task/pages/TaskListPage.vue')
      },
      {
        path: 'evaluations',
        name: 'evaluations',
        component: () => import('../../modules/evaluation/pages/EvaluationListPage.vue')
      }
    ]
  },

  // ─── Error Routes ────────────────────────────────────────
  {
    path: '/403',
    name: '403',
    component: () => import('../../modules/auth/pages/UnauthorizedPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../../modules/auth/pages/NotFoundPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(setupAuthGuards);

export default router;
