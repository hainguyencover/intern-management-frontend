import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { BreadcrumbEntry } from './shellTypes';

export class BreadcrumbEngine {
  static generateBreadcrumbs(route: RouteLocationNormalizedLoaded): BreadcrumbEntry[] {
    const breadcrumbs: BreadcrumbEntry[] = [
      { label: 'Trang chủ', to: '/', icon: 'home' }
    ];

    if (route.path === '/') return breadcrumbs;

    const matched = route.matched.filter((m) => m.meta && m.meta.title);
    for (const m of matched) {
      breadcrumbs.push({
        label: String(m.meta.title || m.name),
        to: m.path
      });
    }

    if (route.meta?.title && !matched.length) {
      breadcrumbs.push({
        label: String(route.meta.title),
        to: route.path
      });
    }

    return breadcrumbs;
  }
}
