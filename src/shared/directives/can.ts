import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

export const vCan: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  }
};

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const authStore = useAuthStore();
  const value = binding.value;

  if (!value) return;

  const hasAccess = authStore.hasPermission(value);

  if (!hasAccess) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    } else {
      el.style.display = 'none';
    }
  }
}
