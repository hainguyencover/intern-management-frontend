import type { RouteRecordRaw } from 'vue-router';
import type { MenuItemConfig, WidgetConfig } from '../shell/shellTypes';

export interface PluginDependency {
  pluginId: string;
  minVersion?: string;
}

export interface PluginApi {
  notify: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
  eventBus: {
    publish: (event: any, payload: any) => void;
  };
  permission: {
    can: (perm: string) => boolean;
  };
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  dependencies?: PluginDependency[];
  routes?: RouteRecordRaw[];
  menus?: MenuItemConfig[];
  widgets?: WidgetConfig[];
  permissions?: string[];
  
  // Lifecycle hooks
  onInstall?: (api: PluginApi) => void | Promise<void>;
  onEnable?: (api: PluginApi) => void | Promise<void>;
  onDisable?: (api: PluginApi) => void | Promise<void>;
  onUnload?: () => void | Promise<void>;
}

export type PluginState = 'uninstalled' | 'installed' | 'enabled' | 'disabled';

export interface PluginItem {
  manifest: PluginManifest;
  state: PluginState;
}
