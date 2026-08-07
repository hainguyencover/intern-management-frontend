import type { PluginApi } from './pluginTypes';
import { notify } from '../notification/notify';
import { eventBus } from '../platform/eventBus';
import { permissionService } from '../platform/permissionService';

export function createPluginSandboxApi(): PluginApi {
  return Object.freeze({
    notify: Object.freeze({
      success: (msg: string) => notify.success(msg),
      error: (msg: string) => notify.error(msg)
    }),
    eventBus: Object.freeze({
      publish: (event: any, payload: any) => eventBus.publish(event, payload)
    }),
    permission: Object.freeze({
      can: (perm: string) => permissionService.can(perm)
    })
  });
}
