import type { Router, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next) => {
    const authStore = useAuthStore();

    if (authStore.isInitializing) {
      await authStore.initializeAuth();
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiredRoles = to.meta.roles as string[] | undefined;
    const requiredPermission = to.meta.permission as string | string[] | undefined;

    // If authenticated and attempting to visit Auth pages (e.g. /auth/login)
    if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
      return next(getRoleDefaultDashboard(authStore.userRole));
    }

    // Require authentication check
    if (requiresAuth && !authStore.isAuthenticated) {
      return next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      });
    }

    // Role check
    if (requiresAuth && requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = authStore.hasRole(requiredRoles);
      if (!hasRequiredRole) {
        return next('/403');
      }
    }

    // Permission check
    if (requiresAuth && requiredPermission) {
      const hasRequiredPerm = authStore.hasPermission(requiredPermission);
      if (!hasRequiredPerm) {
        return next('/403');
      }
    }

    next();
  });
}

function getRoleDefaultDashboard(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'ROLE_ADMIN':
      return '/admin/dashboard';
    case 'HR':
    case 'ROLE_HR':
      return '/hr/dashboard';
    case 'MENTOR':
    case 'ROLE_MENTOR':
      return '/mentor/dashboard';
    case 'INTERN':
    case 'ROLE_INTERN':
      return '/intern/dashboard';
    default:
      return '/auth/login';
  }
}
