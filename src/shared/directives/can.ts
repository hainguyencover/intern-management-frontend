import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '../../modules/auth/store/authStore';

export const vCan: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore();
    const value = binding.value;

    if (!value) return;

    let hasAccess = false;
    if (Array.isArray(value)) {
      hasAccess = value.some((perm) => authStore.permissions.includes(perm));
    } else if (typeof value === 'string') {
      hasAccess = authStore.permissions.includes(value);
    }

    if (!hasAccess) {
      el.parentNode?.removeChild(el);
    }
  }
};
