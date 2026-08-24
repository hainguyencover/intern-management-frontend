import { computed } from 'vue';
import { navigationRegistry } from '../../../shared/shell/navigationRegistry';
import { registerApplicationModules } from '../../../app/bootstrap/registerModules';
import { useAuthStore } from '../store/authStore';

// Ensure application modules are registered into Shell
registerApplicationModules();

export function useNavigation() {
  const authStore = useAuthStore();

  const visibleMenuItems = computed(() => {
    const menus = navigationRegistry.getVisibleMenuItems();

    const isInternRole = authStore.roles.includes('INTERN') || authStore.roles.includes('ROLE_INTERN');
    const isStaffRole = authStore.roles.some(r => ['HR', 'ADMIN', 'ROLE_HR', 'ROLE_ADMIN', 'MENTOR', 'ROLE_MENTOR'].includes(r));

    const candidateUnconfirmedStatuses = ['DRAFT', 'SUBMITTED', 'REVIEWING', 'SCREENING', 'INTERVIEWING', 'NEEDS_REVISION'];
    const currentAppStatus = authStore.user?.applicationStatus || '';

    // Only restrict sidebar for unconfirmed candidates during recruitment
    if (isInternRole && !isStaffRole && candidateUnconfirmedStatuses.includes(currentAppStatus)) {
      const candidateAllowedMenuIds = ['menu-dashboard', 'menu-applications', 'menu-documents', 'menu-intern-profile', 'menu-my-group'];
      return menus.filter(item => candidateAllowedMenuIds.includes(item.id));
    }

    return menus;
  });

  return {
    menuItems: visibleMenuItems
  };
}
