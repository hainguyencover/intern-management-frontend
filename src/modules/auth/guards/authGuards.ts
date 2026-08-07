import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { permissionService } from '../../../shared/platform/permissionService';
import { featureFlags } from '../../../shared/platform/featureFlags';

export function setupAuthGuards(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // 1. Feature Flag Guard check
  if (to.meta.featureFlag) {
    const flag = to.meta.featureFlag as string;
    if (!featureFlags.isEnabled(flag)) {
      return next({ name: '404' });
    }
  }

  // 2. Guest Only routes (e.g. /auth/login)
  if (to.meta.guestOnly && authStore.authenticated) {
    return next({ name: 'dashboard' });
  }

  // 3. Requires Auth routes
  if (to.meta.requiresAuth && !authStore.authenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 4. Role Guard check
  if (to.meta.role) {
    const requiredRole = to.meta.role as string;
    if (!permissionService.hasRole(requiredRole)) {
      return next({ name: '403' });
    }
  }

  // 5. Permission Guard check
  if (to.meta.permission) {
    const requiredPermission = to.meta.permission as string;
    if (!permissionService.can(requiredPermission)) {
      return next({ name: '403' });
    }
  }

  next();
}
