import { metricsRegistry } from './metricsRegistry';
import { errorReporter } from './errorReporter';
import { telemetryCollector } from './telemetryCollector';

export class TelemetryExporter {
  exportSummary() {
    const summary = {
      metrics: metricsRegistry.getMetrics(),
      errors: errorReporter.getErrors(),
      events: telemetryCollector.getEvents(),
      exportedAt: new Date().toISOString()
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Telemetry Summary Export]:', summary);
    }
    return summary;
  }
}

export const telemetryExporter = new TelemetryExporter();
