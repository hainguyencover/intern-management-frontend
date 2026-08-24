import { usePermissionStore } from '@/stores/permissionStore';

export function hasPermission(code: string): boolean {
  const store = usePermissionStore();
  return store.hasPermission(code);
}

export const vPermission = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const store = usePermissionStore();
    if (!store.hasPermission(binding.value)) {
      el.style.display = 'none';
    }
  }
};
