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
        title: 'Dashboard',
        icon: 'dashboard',
        to: '/',
        order: 1
      }
    ]
  });

  // Organization Module
  moduleRegistry.registerModule({
    id: 'organization',
    name: 'Organization',
    menus: [
      {
        id: 'menu-organization-departments',
        title: 'Quản lý Phòng ban',
        icon: 'corporate_fare',
        to: '/organization/departments',
        permission: Permissions.Department.Read,
        order: 2
      }
    ]
  });

  // Intern Module
  moduleRegistry.registerModule({
    id: 'intern',
    name: 'Intern Management',
    menus: [
      {
        id: 'menu-interns',
        title: 'Hồ sơ Thực tập sinh',
        icon: 'people',
        to: '/interns',
        permission: Permissions.Intern.Read,
        order: 3
      }
    ]
  });

  // Task Module
  moduleRegistry.registerModule({
    id: 'task',
    name: 'Task & Daily Report',
    menus: [
      {
        id: 'menu-tasks',
        title: 'Nhiệm vụ & Báo cáo',
        icon: 'task',
        to: '/tasks',
        permission: Permissions.Task.Read,
        order: 4
      }
    ]
  });

  // Evaluation Module
  moduleRegistry.registerModule({
    id: 'evaluation',
    name: 'Evaluation & Performance',
    menus: [
      {
        id: 'menu-evaluations',
        title: 'Đánh giá & Hiệu suất',
        icon: 'assessment',
        to: '/evaluations',
        permission: Permissions.Evaluation.Read,
        order: 5
      }
    ]
  });
}
