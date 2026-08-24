import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

export const vRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore();
    const value = binding.value;

    if (!value) return;

    const hasRole = authStore.hasRole(value);

    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  }
};
