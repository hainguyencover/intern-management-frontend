import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/api/apiClient';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const isInitializing = ref(true);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || 'GUEST');
  const roles = computed<string[]>(() => {
    if (!user.value) return [];
    if (user.value.roles && user.value.roles.length > 0) return user.value.roles;
    return user.value.role ? [user.value.role] : [];
  });

  const permissions = computed<string[]>(() => user.value?.permissions || []);

  const setAuth = (authData: LoginResponse) => {
    token.value = authData.accessToken;
    refreshToken.value = authData.refreshToken;
    user.value = authData.user;

    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(authData.user));
  };

  const logout = () => {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  };

  const initializeAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user_info');
      const storedToken = localStorage.getItem('access_token');

      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        
        // Optionally fetch current profile to verify token status
        try {
          const { data } = await apiClient.get<User>('/auth/me');
          user.value = data;
          localStorage.setItem('user_info', JSON.stringify(data));
        } catch (e) {
          // If profile fetch fails on boot, clear token if 401
        }
      }
    } catch (e) {
      logout();
    } finally {
      isInitializing.value = false;
    }
  };

  const hasRole = (roleOrRoles: string | string[]): boolean => {
    if (!isAuthenticated.value) return false;
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some((r) => roles.value.includes(r) || roles.value.includes(`ROLE_${r}`));
    }
    return roles.value.includes(roleOrRoles) || roles.value.includes(`ROLE_${roleOrRoles}`);
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!isAuthenticated.value) return false;
    if (hasRole(['ADMIN', 'HR'])) return true;
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.value.includes(p));
    }
    return permissions.value.includes(permission) || permissions.value.includes('*');
  };

  return {
    user,
    token,
    refreshToken,
    isInitializing,
    isAuthenticated,
    userRole,
    roles,
    permissions,
    setAuth,
    logout,
    initializeAuth,
    hasRole,
    hasPermission
  };
});
