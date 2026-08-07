import { useAuthStore } from '../store/auth';

export function usePermission() {
  const authStore = useAuthStore();

  function hasPermission(permission: string): boolean {
    return authStore.permissions.includes(permission);
  }

  function hasRole(role: string): boolean {
    return authStore.roles.includes(role);
  }

  function can(permission: string): boolean {
    return hasPermission(permission);
  }

  function canAny(permissions: string[]): boolean {
    return permissions.some(p => hasPermission(p));
  }

  function canAll(permissions: string[]): boolean {
    return permissions.every(p => hasPermission(p));
  }

  return {
    hasPermission,
    hasRole,
    can,
    canAny,
    canAll
  };
}
