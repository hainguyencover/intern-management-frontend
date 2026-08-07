import { moduleRegistry } from './moduleRegistry';
import type { MenuItemConfig } from './shellTypes';
import { permissionService } from '../platform/permissionService';
import { featureFlags } from '../platform/featureFlags';

export class NavigationRegistry {
  getVisibleMenuItems(): MenuItemConfig[] {
    const allMenus: MenuItemConfig[] = [];

    // Aggregate menus from registered modules
    moduleRegistry.getAllModules().forEach((mod) => {
      if (mod.menus) {
        allMenus.push(...mod.menus);
      }
    });

    // Sort by order if specified
    allMenus.sort((a, b) => (a.order || 99) - (b.order || 99));

    // Filter by Permission & Feature Flags
    return allMenus.filter((item) => {
      if (item.featureFlag && !featureFlags.isEnabled(item.featureFlag)) {
        return false;
      }
      if (item.permission && !permissionService.can(item.permission)) {
        return false;
      }
      if (item.role && !permissionService.hasRole(item.role)) {
        return false;
      }
      return true;
    });
  }
}

export const navigationRegistry = new NavigationRegistry();
