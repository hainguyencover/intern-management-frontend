export class FeatureFlagManager {
  private flags = new Map<string, boolean>();

  constructor() {
    // Default system feature flags
    this.flags.set('beta-dashboard', true);
    this.flags.set('evaluation-v2', true);
    this.flags.set('dark-mode', false);
  }

  setFlag(flag: string, enabled: boolean): void {
    this.flags.set(flag, enabled);
  }

  isEnabled(flag: string): boolean {
    return this.flags.get(flag) ?? false;
  }

  getAllFlags(): Record<string, boolean> {
    const res: Record<string, boolean> = {};
    this.flags.forEach((val, key) => {
      res[key] = val;
    });
    return res;
  }
}

export const featureFlags = new FeatureFlagManager();

export const vFeature = {
  mounted(el: HTMLElement, binding: { value: string }) {
    if (!featureFlags.isEnabled(binding.value)) {
      el.style.display = 'none';
    }
  }
};
