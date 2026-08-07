import type { PluginManifest, PluginItem } from './pluginTypes';
import { createPluginSandboxApi } from './pluginSandbox';
import { moduleRegistry } from '../shell/moduleRegistry';

export class PluginRegistryManager {
  private plugins = new Map<string, PluginItem>();

  async installPlugin(manifest: PluginManifest): Promise<boolean> {
    if (this.plugins.has(manifest.id)) {
      console.warn(`[PluginRegistry] Plugin "${manifest.id}" is already installed.`);
      return false;
    }

    // Check dependencies
    if (manifest.dependencies && manifest.dependencies.length > 0) {
      for (const dep of manifest.dependencies) {
        if (!this.plugins.has(dep.pluginId)) {
          console.error(`[PluginRegistry] Cannot install "${manifest.id}". Missing dependency "${dep.pluginId}".`);
          return false;
        }
      }
    }

    const sandboxApi = createPluginSandboxApi();

    if (manifest.onInstall) {
      await manifest.onInstall(sandboxApi);
    }

    // Register manifest into ModuleRegistry so shell automatically recognizes routes, menus, widgets
    moduleRegistry.registerModule({
      id: `plugin-${manifest.id}`,
      name: manifest.name,
      routes: manifest.routes,
      menus: manifest.menus,
      widgets: manifest.widgets,
      permissions: manifest.permissions
    });

    this.plugins.set(manifest.id, {
      manifest,
      state: 'installed'
    });

    return true;
  }

  async enablePlugin(id: string): Promise<boolean> {
    const item = this.plugins.get(id);
    if (!item) return false;

    if (item.state === 'enabled') return true;

    const sandboxApi = createPluginSandboxApi();
    if (item.manifest.onEnable) {
      await item.manifest.onEnable(sandboxApi);
    }

    item.state = 'enabled';
    return true;
  }

  async disablePlugin(id: string): Promise<boolean> {
    const item = this.plugins.get(id);
    if (!item || item.state !== 'enabled') return false;

    const sandboxApi = createPluginSandboxApi();
    if (item.manifest.onDisable) {
      await item.manifest.onDisable(sandboxApi);
    }

    item.state = 'disabled';
    return true;
  }

  getPlugin(id: string): PluginItem | undefined {
    return this.plugins.get(id);
  }

  getAllPlugins(): PluginItem[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistryManager();
