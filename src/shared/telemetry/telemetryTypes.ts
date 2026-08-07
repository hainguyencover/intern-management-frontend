export type MetricType = 'counter' | 'timer' | 'gauge';

export interface MetricItem {
  name: string;
  type: MetricType;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
}

export interface PerformanceMetric {
  name: string;
  durationMs: number;
  category: 'api' | 'navigation' | 'render';
  timestamp: string;
}

export interface ErrorRecord {
  message: string;
  stack?: string;
  source?: string;
  timestamp: string;
}

export interface TelemetryEvent {
  id: string;
  eventName: string;
  payload: any;
  timestamp: string;
}
