import { computed } from 'vue';
import { navigationRegistry } from '../../../shared/shell/navigationRegistry';
import { registerApplicationModules } from '../../../app/bootstrap/registerModules';

// Ensure application modules are registered into Shell
registerApplicationModules();

export function useNavigation() {
  const visibleMenuItems = computed(() => {
    return navigationRegistry.getVisibleMenuItems();
  });

  return {
    menuItems: visibleMenuItems
  };
}
