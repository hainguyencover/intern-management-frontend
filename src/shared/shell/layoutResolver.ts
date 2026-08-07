import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { RouteMetaResolver } from './routeMetaResolver';

export class LayoutResolver {
  static resolveLayoutComponent(route: RouteLocationNormalizedLoaded): string {
    const meta = RouteMetaResolver.resolve(route);
    switch (meta.layout) {
      case 'list':
        return 'ListPageLayout';
      case 'detail':
        return 'DetailPageLayout';
      case 'blank':
        return 'BlankLayout';
      default:
        return 'DefaultLayout';
    }
  }
}
