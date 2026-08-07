import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '../../modules/auth/store/authStore';

export const vRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore();
    const value = binding.value;

    if (!value) return;

    let hasRole = false;
    if (Array.isArray(value)) {
      hasRole = value.some((role) => authStore.roles.includes(role));
    } else if (typeof value === 'string') {
      hasRole = authStore.roles.includes(value);
    }

    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  }
};
