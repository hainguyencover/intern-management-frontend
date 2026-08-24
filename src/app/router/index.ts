import { createRouter, createWebHistory } from 'vue-router';
import { setupAuthGuards } from '../../modules/auth/guards/authGuards';

const routes = [
  // ─── Guest & Public Auth Routes (GuestLayout) ─────────────
  {
    path: '/',
    component: () => import('../layouts/GuestLayout.vue'),
    children: [
      {
        path: 'auth/login',
        alias: ['/login'],
        name: 'login',
        meta: { guestOnly: true },
        component: () => import('../../modules/auth/pages/LoginPage.vue')
      },
      {
        path: 'auth/register',
        alias: ['/register'],
        name: 'register',
        meta: { guestOnly: true },
        component: () => import('../../modules/auth/pages/RegisterPage.vue')
      },
      {
        path: 'auth/verify-email',
        alias: ['/verify-email'],
        name: 'verify-email',
        component: () => import('../../modules/auth/pages/VerifyEmailPage.vue')
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
        alias: ['dashboard', '/dashboard'],
        name: 'dashboard',
        component: () => import('../../modules/dashboard/pages/DashboardPage.vue')
      },
      {
        path: 'applications/new',
        name: 'application-new',
        meta: { requiresAuth: true, requiresVerifiedEmail: true },
        component: () => import('../../modules/applications/pages/ApplicationWizardPage.vue')
      },
      {
        path: 'applications/submitted',
        name: 'application-submitted',
        meta: { requiresAuth: true },
        component: () => import('../../modules/applications/pages/ApplicationSubmittedPage.vue')
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
        path: 'mentor/tasks',
        name: 'mentor-tasks',
        component: () => import('../../features/task/pages/MentorTaskPage.vue')
      },
      {
        path: 'intern/tasks',
        name: 'intern-tasks',
        component: () => import('../../features/task/pages/InternTaskPage.vue')
      },

      {
        path: 'programs',
        name: 'programs',
        component: () => import('../../modules/program/pages/ProgramListPage.vue')
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import('../../modules/group/pages/GroupListPage.vue')
      },
      {
        path: 'interns/profile',
        name: 'intern-profile',
        component: () => import('../../modules/intern/pages/InternProfilePage.vue')
      },
      {
        path: 'my-group',
        name: 'my-group',
        component: () => import('../../modules/intern/pages/MyGroupPage.vue')
      },
      {
        path: 'schedule',
        alias: ['/interns/me/schedule'],
        name: 'schedule',
        component: () => import('../../modules/intern/pages/InternSchedulePage.vue')
      },
      {
        path: 'mentor/expertise',
        name: 'mentor-expertise',
        component: () => import('../../modules/mentor/pages/MentorExpertisePage.vue')
      },
      {
        path: 'mentors',
        name: 'mentors',
        component: () => import('../../modules/mentor/pages/MentorListPage.vue')
      },
      {
        path: 'mentors/:id',
        name: 'mentor-detail',
        component: () => import('../../modules/mentor/pages/MentorDetailPage.vue')
      },
      {
        path: 'mentor/dashboard',
        name: 'mentor-dashboard',
        component: () => import('../../modules/mentor/pages/MentorDashboardPage.vue')
      },
      {
        path: 'attendance',
        name: 'attendance',
        component: () => import('../../modules/attendance/pages/AttendancePage.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../../modules/reports/pages/ReportExportPage.vue')
      },
      {
        path: 'intern/weekly-reports',
        alias: ['/interns/me/weekly-reports'],
        name: 'intern-weekly-reports',
        component: () => import('../../modules/reports/pages/InternWeeklyReportPage.vue')
      },
      {
        path: 'mentor/weekly-reports',
        name: 'mentor-weekly-reports',
        component: () => import('../../modules/reports/pages/MentorWeeklyReportPage.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../../modules/users/pages/UserListPage.vue')
      },
      {
        path: 'evaluations',
        name: 'evaluations',
        component: () => import('../../modules/evaluation/pages/EvaluationListPage.vue')
      },
      {
        path: 'audit-logs',
        name: 'audit-logs',
        component: () => import('../../modules/audit/pages/AuditLogListPage.vue')
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('../../modules/tickets/pages/TicketListPage.vue')
      },
      {
        path: 'allowances',
        name: 'allowances',
        component: () => import('../../modules/allowance/pages/AllowanceListPage.vue')
      },
      {
        path: 'documents',
        name: 'documents',
        component: () => import('../../modules/documents/pages/DocumentListPage.vue')
      },
      {
        path: 'applications',
        name: 'applications',
        component: () => import('../../modules/applications/pages/ApplicationListPage.vue')
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('../../modules/organization/pages/OrganizationPage.vue')
      }
    ]
  },

  // ─── Error Routes ────────────────────────────────────────
  {
    path: '/',
    component: () => import('../layouts/GuestLayout.vue'),
    children: [
      {
        path: '403',
        name: '403',
        component: () => import('../../modules/auth/pages/UnauthorizedPage.vue')
      },
      {
        path: ':pathMatch(.*)*',
        name: '404',
        component: () => import('../../modules/auth/pages/NotFoundPage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(setupAuthGuards);

export default router;
