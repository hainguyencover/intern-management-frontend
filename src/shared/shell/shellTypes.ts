import type { RouteRecordRaw } from 'vue-router';

export interface MenuItemConfig {
  id: string;
  title: string;
  icon: string;
  to: string;
  permission?: string;
  role?: string;
  featureFlag?: string;
  order?: number;
}

export interface WidgetConfig {
  id: string;
  title: string;
  componentName: string;
  permission?: string;
  featureFlag?: string;
}

export interface AppModuleManifest {
  id: string;
  name: string;
  routes?: RouteRecordRaw[];
  menus?: MenuItemConfig[];
  widgets?: WidgetConfig[];
  permissions?: string[];
}

export interface BreadcrumbEntry {
  label: string;
  to?: string;
  icon?: string;
}
