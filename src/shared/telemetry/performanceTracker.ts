import type { PerformanceMetric } from './telemetryTypes';
import { metricsRegistry } from './metricsRegistry';

export class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];

  measure(name: string, category: 'api' | 'navigation' | 'render', durationMs: number): void {
    const item: PerformanceMetric = {
      name,
      category,
      durationMs,
      timestamp: new Date().toISOString()
    };
    this.metrics.push(item);
    metricsRegistry.recordTimer(`perf_${category}_${name}`, durationMs);
  }

  async time<T>(name: string, category: 'api' | 'navigation' | 'render', fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.measure(name, category, duration);
    }
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const performanceTracker = new PerformanceTracker();
