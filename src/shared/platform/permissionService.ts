import { useAuthStore } from '../../modules/auth/store/authStore';

export class PermissionResolverService {
  can(permission: string): boolean {
    const authStore = useAuthStore();
    if (!authStore.user) return false;
    // Admin has superuser access
    if (authStore.roles.includes('ADMIN')) return true;
    return authStore.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    const authStore = useAuthStore();
    if (!authStore.roles || authStore.roles.length === 0) return false;
    const targetRole = role.toUpperCase().replace('ROLE_', '');
    return authStore.roles.some(r => r.toUpperCase().replace('ROLE_', '') === targetRole);
  }
}

export const permissionService = new PermissionResolverService();
