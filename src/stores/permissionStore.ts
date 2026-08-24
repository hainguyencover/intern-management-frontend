import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<string[]>([]);

  function setPermissions(userPermissions: string[]) {
    permissions.value = userPermissions;
  }

  function hasPermission(permissionCode: string): boolean {
    if (!permissions.value || permissions.value.length === 0) return true;
    return permissions.value.includes(permissionCode) || permissions.value.includes('ALL');
  }

  return {
    permissions,
    setPermissions,
    hasPermission
  };
});
