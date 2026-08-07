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
    return authStore.roles.includes(role);
  }
}

export const permissionService = new PermissionResolverService();
