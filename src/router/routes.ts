import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { title: 'Đăng nhập - IMS' }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: { title: 'Quên mật khẩu - IMS' }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: { title: 'Đặt lại mật khẩu - IMS' }
      },
      {
        path: 'activate',
        name: 'activate-account',
        component: () => import('@/pages/auth/ActivateAccountPage.vue'),
        meta: { title: 'Kích hoạt tài khoản - IMS' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/AdminDashboardPage.vue'),
        meta: { title: 'Admin Dashboard' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/pages/admin/UserListPage.vue'),
        meta: { title: 'Quản lý Người dùng' }
      },
      {
        path: 'roles',
        name: 'admin-roles',
        component: () => import('@/pages/admin/RolePermissionPage.vue'),
        meta: { title: 'Vai trò & Phân quyền' }
      },
      {
        path: 'backups',
        name: 'admin-backups',
        component: () => import('@/pages/admin/BackupManagementPage.vue'),
        meta: { title: 'Sao lưu & Khôi phục (Backup & Restore)' }
      },
      {
        path: 'audit-logs',
        name: 'admin-audit-logs',
        component: () => import('@/pages/admin/AuditLogPage.vue'),
        meta: { title: 'Nhật ký Hoạt động (Audit Logs)' }
      },
      {
        path: 'integrations',
        name: 'admin-integrations',
        component: () => import('@/pages/integrations/IntegrationPage.vue'),
        meta: { title: 'Tích hợp hệ thống' }
      },
      {
        path: 'integrations/history',
        name: 'SyncHistoryPage',
        component: () => import('@/pages/integrations/SyncHistoryPage.vue'),
        meta: { title: 'Lịch sử đồng bộ' }
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/pages/auth/UserProfilePage.vue'),
        meta: { title: 'Hồ sơ cá nhân' }
      }
    ]
  },
  {
    path: '/hr',
    component: () => import('@/layouts/HrLayout.vue'),
    meta: { requiresAuth: true, roles: ['HR', 'ROLE_HR', 'ADMIN', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'hr-dashboard',
        component: () => import('@/pages/hr/HrDashboardPage.vue'),
        meta: { title: 'HR Dashboard' }
      },
      {
        path: 'interns',
        name: 'hr-interns',
        component: () => import('@/pages/hr/intern/InternProfileListPage.vue'),
        meta: { title: 'Quản lý Thực tập sinh' }
      },
      {
        path: 'interns/:id',
        name: 'hr-intern-detail',
        component: () => import('@/pages/hr/intern/InternProfileDetailPage.vue'),
        meta: { title: 'Chi tiết Hồ sơ Thực tập sinh' }
      },
      {
        path: 'mentors',
        name: 'hr-mentors',
        component: () => import('@/pages/hr/mentor/MentorManagementPage.vue'),
        meta: { title: 'Quản lý Mentor' }
      },
      {
        path: 'mentors/workload',
        name: 'hr-mentor-workload',
        component: () => import('@/pages/hr/mentor/MentorWorkloadPage.vue'),
        meta: { title: 'Theo dõi khối lượng Mentor' }
      },
      {
        path: 'mentors/matching',
        name: 'hr-mentor-matching',
        component: () => import('@/pages/hr/mentor/HrMentorSearchPage.vue'),
        meta: { title: 'Tra cứu & Matching Mentor' }
      },
      {
        path: 'contracts',
        name: 'hr-contracts',
        component: () => import('@/pages/hr/contract/ContractListPage.vue'),
        meta: { title: 'Quản lý Hợp đồng' }
      },
      {
        path: 'documents',
        name: 'hr-documents',
        component: () => import('@/pages/hr/document/DocumentReviewPage.vue'),
        meta: { title: 'Duyệt Tài liệu' }
      },
      {
        path: 'programs',
        name: 'hr-programs',
        component: () => import('@/pages/hr/program/ProgramListPage.vue'),
        meta: { title: 'Quản lý Chương trình tuyển dụng' }
      },
      {
        path: 'reports',
        name: 'hr-reports',
        component: () => import('@/pages/reports/ReportPage.vue'),
        meta: { title: 'Báo cáo & Thống kê' }
      },
      {
        path: 'reports/history',
        name: 'hr-report-history',
        component: () => import('@/pages/reports/ExportHistoryPage.vue'),
        meta: { title: 'Lịch sử Xuất báo cáo' }
      },
      {
        path: 'profile',
        name: 'hr-profile',
        component: () => import('@/pages/auth/UserProfilePage.vue'),
        meta: { title: 'Hồ sơ cá nhân' }
      }
    ]
  },
  {
    path: '/mentor',
    component: () => import('@/layouts/MentorLayout.vue'),
    meta: { requiresAuth: true, roles: ['MENTOR', 'ROLE_MENTOR', 'ADMIN', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'mentor-dashboard',
        component: () => import('@/pages/mentor/MentorDashboardPage.vue'),
        meta: { title: 'Mentor Dashboard' }
      },
      {
        path: 'profile',
        name: 'mentor-profile',
        component: () => import('@/pages/mentor/MentorProfilePage.vue'),
        meta: { title: 'Hồ sơ năng lực Mentor' }
      }
    ]
  },
  {
    path: '/intern',
    component: () => import('@/layouts/InternLayout.vue'),
    meta: { requiresAuth: true, roles: ['INTERN', 'ROLE_INTERN', 'ADMIN', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'intern-dashboard',
        component: () => import('@/pages/intern/InternDashboardPage.vue'),
        meta: { title: 'Intern Dashboard' }
      },
      {
        path: 'documents',
        name: 'intern-documents',
        component: () => import('@/pages/intern/document/InternDocumentPage.vue'),
        meta: { title: 'Quản lý Tài liệu cá nhân' }
      },
      {
        path: 'contracts',
        name: 'intern-contracts',
        component: () => import('@/pages/intern/contract/InternContractPage.vue'),
        meta: { title: 'Hợp đồng Thực tập' }
      },
      {
        path: 'schedule',
        name: 'intern-schedule',
        component: () => import('@/pages/intern/schedule/InternSchedulePage.vue'),
        meta: { title: 'Lịch trình & Cột mốc' }
      },
      {
        path: 'profile',
        name: 'intern-profile',
        component: () => import('@/pages/auth/UserProfilePage.vue'),
        meta: { title: 'Hồ sơ cá nhân' }
      }
    ]
  },
  {
    path: '/university',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['UNIVERSITY_ADMIN', 'UNIVERSITY_VIEWER', 'ROLE_UNIVERSITY_ADMIN', 'ROLE_UNIVERSITY_VIEWER', 'ADMIN', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'university-dashboard',
        component: () => import('@/pages/university/UniversityDashboardPage.vue'),
        meta: { title: 'University Portal - Dashboard' }
      },
      {
        path: 'students',
        name: 'university-students',
        component: () => import('@/pages/university/UniversityStudentListPage.vue'),
        meta: { title: 'Danh sách Sinh viên Thực tập' }
      },
      {
        path: 'students/:studentId',
        name: 'university-student-detail',
        component: () => import('@/pages/university/UniversityStudentDetailPage.vue'),
        meta: { title: 'Chi tiết Tiến độ Sinh viên' }
      },
      {
        path: 'notifications',
        name: 'university-notifications',
        component: () => import('@/pages/university/UniversityNotificationsPage.vue'),
        meta: { title: 'Thông báo Trường Đại Học' }
      }
    ]
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/notification/NotificationPage.vue'),
    meta: { requiresAuth: true, title: 'Trung tâm thông báo' }
  },
  {
    path: '/notifications/preferences',
    name: 'notification-preferences',
    component: () => import('@/pages/notification/NotificationPreferencesPage.vue'),
    meta: { requiresAuth: true, title: 'Cài đặt thông báo' }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/pages/feedback/ForbiddenPage.vue'),
    meta: { title: '403 Forbidden' }
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('@/pages/feedback/NotFoundPage.vue'),
    meta: { title: '404 Not Found' }
  }
];

export default routes;
