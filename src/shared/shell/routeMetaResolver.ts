import type { RouteLocationNormalizedLoaded } from 'vue-router';

export interface StandardRouteMeta {
  title?: string;
  subtitle?: string;
  layout?: 'default' | 'list' | 'detail' | 'blank';
  permission?: string;
  featureFlag?: string;
  keepAlive?: boolean;
}

export class RouteMetaResolver {
  static resolve(route: RouteLocationNormalizedLoaded): StandardRouteMeta {
    const meta = route.meta || {};
    return {
      title: (meta.title as string) || undefined,
      subtitle: (meta.subtitle as string) || undefined,
      layout: (meta.layout as any) || 'default',
      permission: (meta.permission as string) || undefined,
      featureFlag: (meta.featureFlag as string) || undefined,
      keepAlive: Boolean(meta.keepAlive)
    };
  }
}
