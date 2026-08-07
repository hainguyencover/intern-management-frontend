import type { MetricItem, MetricType } from './telemetryTypes';

export class MetricsRegistry {
  private metrics: MetricItem[] = [];

  incrementCounter(name: string, value = 1, tags?: Record<string, string>): void {
    this.recordMetric(name, 'counter', value, tags);
  }

  recordTimer(name: string, durationMs: number, tags?: Record<string, string>): void {
    this.recordMetric(name, 'timer', durationMs, tags);
  }

  setGauge(name: string, value: number, tags?: Record<string, string>): void {
    this.recordMetric(name, 'gauge', value, tags);
  }

  private recordMetric(name: string, type: MetricType, value: number, tags?: Record<string, string>): void {
    const item: MetricItem = {
      name,
      type,
      value,
      tags,
      timestamp: new Date().toISOString()
    };
    this.metrics.push(item);
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
  }

  getMetrics(): MetricItem[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}

export const metricsRegistry = new MetricsRegistry();
