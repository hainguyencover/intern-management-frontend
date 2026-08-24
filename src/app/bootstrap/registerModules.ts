import { moduleRegistry } from '../../shared/shell/moduleRegistry';
import { Permissions } from '../../shared/constants/permissions';

export function registerApplicationModules(): void {
  // Dashboard Module
  moduleRegistry.registerModule({
    id: 'dashboard',
    name: 'Dashboard',
    menus: [
      {
        id: 'menu-dashboard',
        title: 'Dashboard Tổng quan',
        icon: 'dashboard',
        to: '/dashboard',
        roles: ['ADMIN', 'HR', 'MENTOR', 'INTERN'],
        order: 1
      }
    ]
  });

  // Program Module (HR / Admin)
  moduleRegistry.registerModule({
    id: 'program',
    name: 'Program Management',
    menus: [
      {
        id: 'menu-programs',
        title: 'Chương trình Thực tập',
        icon: 'school',
        to: '/programs',
        roles: ['HR', 'ADMIN'],
        order: 2
      }
    ]
  });

  // Group & Mentor Placement Module (Mentor / HR / Admin)
  moduleRegistry.registerModule({
    id: 'group',
    name: 'Group Management',
    menus: [
      {
        id: 'menu-groups',
        title: 'Nhóm & Phân công Mentor',
        icon: 'groups',
        to: '/groups',
        roles: ['MENTOR', 'HR', 'ADMIN'],
        order: 3
      }
    ]
  });

  // Intern Profile Module (HR / Admin / Mentor)
  moduleRegistry.registerModule({
    id: 'intern',
    name: 'Intern Management',
    menus: [
      {
        id: 'menu-interns',
        title: 'Hồ sơ Thực tập sinh',
        icon: 'people',
        to: '/interns',
        roles: ['HR', 'ADMIN', 'MENTOR'],
        order: 3
      },
      {
        id: 'menu-intern-profile',
        title: 'Hồ sơ cá nhân',
        icon: 'account_circle',
        to: '/interns/profile',
        roles: ['INTERN'],
        order: 2
      },
      {
        id: 'menu-my-group',
        title: 'Nhóm thực tập của tôi',
        icon: 'groups',
        to: '/my-group',
        roles: ['INTERN'],
        order: 2.5
      },
      {
        id: 'menu-intern-schedule',
        title: 'Lịch trình Thực tập',
        icon: 'event',
        to: '/schedule',
        roles: ['INTERN'],
        order: 2.8
      },
      {
        id: 'menu-mentor-expertise',
        title: 'Hồ sơ năng lực Mentor',
        icon: 'psychology',
        to: '/mentor/expertise',
        roles: ['MENTOR'],
        order: 2
      }
    ]
  });

  // Task & Weekly Report Module (Intern / Mentor / HR / Admin)
  moduleRegistry.registerModule({
    id: 'task',
    name: 'Task & Weekly Reports',
    menus: [
      {
        id: 'menu-tasks-intern',
        title: 'Nhiệm vụ của tôi',
        icon: 'task',
        to: '/intern/tasks',
        roles: ['INTERN'],
        order: 4
      },
      {
        id: 'menu-tasks-mentor',
        title: 'Quản lý nhiệm vụ',
        icon: 'task',
        to: '/mentor/tasks',
        roles: ['MENTOR'],
        order: 4
      },
      {
        id: 'menu-tasks-staff',
        title: 'Nhiệm vụ & Báo cáo',
        icon: 'task',
        to: '/tasks',
        roles: ['HR', 'ADMIN'],
        order: 4
      }
    ]
  });

  // Attendance & Leave Module (Intern / Mentor / HR / Admin)
  moduleRegistry.registerModule({
    id: 'attendance',
    name: 'Attendance & Leave',
    menus: [
      {
        id: 'menu-attendance',
        title: 'Điểm danh & Xin nghỉ',
        icon: 'how_to_reg',
        to: '/attendance',
        roles: ['INTERN', 'MENTOR', 'HR', 'ADMIN'],
        order: 5
      }
    ]
  });

  // Evaluation & Performance Module (Mentor / HR / Admin / Intern)
  moduleRegistry.registerModule({
    id: 'evaluation',
    name: 'Evaluation & Performance',
    menus: [
      {
        id: 'menu-evaluations',
        title: 'Đánh giá & Kết quả',
        icon: 'assessment',
        to: '/evaluations',
        roles: ['MENTOR', 'HR', 'ADMIN', 'INTERN'],
        order: 6
      }
    ]
  });

  // Reports Export Module (HR / Admin)
  moduleRegistry.registerModule({
    id: 'reports',
    name: 'Reports & Export',
    menus: [
      {
        id: 'menu-reports',
        title: 'Báo cáo & Export Excel',
        icon: 'summarize',
        to: '/reports',
        roles: ['HR', 'ADMIN'],
        order: 7
      }
    ]
  });

  // User & Security Management Module (Admin)
  moduleRegistry.registerModule({
    id: 'users',
    name: 'User & Security',
    menus: [
      {
        id: 'menu-users',
        title: 'Quản lý Tài khoản & Quyền',
        icon: 'admin_panel_settings',
        to: '/users',
        roles: ['ADMIN'],
        order: 8
      }
    ]
  });

  // Audit Log Module (Admin)
  moduleRegistry.registerModule({
    id: 'audit',
    name: 'Audit Logs',
    menus: [
      {
        id: 'menu-audit',
        title: 'Nhật ký Audit Logs',
        icon: 'receipt_long',
        to: '/audit-logs',
        roles: ['ADMIN'],
        order: 9
      }
    ]
  });

  // Organization Module (Admin / HR)
  moduleRegistry.registerModule({
    id: 'organization',
    name: 'Organization',
    menus: [
      {
        id: 'menu-organization-departments',
        title: 'Quản lý Phòng ban',
        icon: 'corporate_fare',
        to: '/organization/departments',
        roles: ['ADMIN', 'HR'],
        order: 10
      }
    ]
  });

  // Support Ticket Module (All Roles)
  moduleRegistry.registerModule({
    id: 'tickets',
    name: 'Support Tickets',
    menus: [
      {
        id: 'menu-tickets',
        title: 'Yêu cầu Hỗ trợ (Tickets)',
        icon: 'support_agent',
        to: '/tickets',
        roles: ['INTERN', 'HR', 'ADMIN', 'MENTOR'],
        order: 11
      }
    ]
  });

  // Allowance Module (HR / Admin / Intern)
  moduleRegistry.registerModule({
    id: 'allowance',
    name: 'Allowance Management',
    menus: [
      {
        id: 'menu-allowance',
        title: 'Quản lý Phụ cấp',
        icon: 'payments',
        to: '/allowances',
        roles: ['HR', 'ADMIN', 'INTERN'],
        order: 12
      }
    ]
  });

  // Documents & Contracts Module (All Roles)
  moduleRegistry.registerModule({
    id: 'documents',
    name: 'Documents & Contracts',
    menus: [
      {
        id: 'menu-documents',
        title: 'Tài liệu & Hợp đồng',
        icon: 'folder_shared',
        to: '/documents',
        roles: ['INTERN', 'HR', 'ADMIN', 'MENTOR'],
        order: 13
      }
    ]
  });

  // Application Portal Module (HR / Admin / Candidate / Intern)
  moduleRegistry.registerModule({
    id: 'applications',
    name: 'Application Portal',
    menus: [
      {
        id: 'menu-applications',
        title: 'Đơn Ứng tuyển & AI Review',
        icon: 'how_to_vote',
        to: '/applications',
        roles: ['INTERN', 'HR', 'ADMIN'],
        order: 14
      }
    ]
  });

  // Organization Master Data Module (HR / Admin)
  moduleRegistry.registerModule({
    id: 'organization-master-data',
    name: 'Organization Master Data',
    menus: [
      {
        id: 'menu-organization',
        title: 'Sơ đồ Tổ chức & Master Data',
        icon: 'account_tree',
        to: '/organization',
        roles: ['HR', 'ADMIN'],
        order: 15
      }
    ]
  });
}
