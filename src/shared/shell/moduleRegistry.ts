import type { AppModuleManifest, WidgetConfig } from './shellTypes';

export class ModuleRegistry {
  private modules = new Map<string, AppModuleManifest>();

  registerModule(manifest: AppModuleManifest): void {
    if (this.modules.has(manifest.id)) {
      console.warn(`[ModuleRegistry] Module with ID "${manifest.id}" is already registered. Overwriting...`);
    }
    this.modules.set(manifest.id, manifest);
  }

  getModule(id: string): AppModuleManifest | undefined {
    return this.modules.get(id);
  }

  getAllModules(): AppModuleManifest[] {
    return Array.from(this.modules.values());
  }

  getRegisteredWidgets(): WidgetConfig[] {
    const widgets: WidgetConfig[] = [];
    this.getAllModules().forEach((mod) => {
      if (mod.widgets) {
        widgets.push(...mod.widgets);
      }
    });
    return widgets;
  }

  clear(): void {
    this.modules.clear();
  }
}

export const moduleRegistry = new ModuleRegistry();
