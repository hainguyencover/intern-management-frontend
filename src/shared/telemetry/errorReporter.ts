import type { ErrorRecord } from './telemetryTypes';
import { metricsRegistry } from './metricsRegistry';

export class ErrorReporter {
  private errors: ErrorRecord[] = [];
  private originalOnError: any = null;
  private originalOnRejection: any = null;

  start(): void {
    if (typeof window === 'undefined') return;

    this.originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.report(error || String(message), 'window.onerror');
      if (this.originalOnError) {
        this.originalOnError(message, source, lineno, colno, error);
      }
    };

    this.originalOnRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      this.report(event.reason || 'Unhandled Promise Rejection', 'unhandledrejection');
      if (this.originalOnRejection) {
        this.originalOnRejection(event);
      }
    };
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    window.onerror = this.originalOnError;
    window.onunhandledrejection = this.originalOnRejection;
  }

  report(error: Error | string, source = 'application'): void {
    const item: ErrorRecord = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      source,
      timestamp: new Date().toISOString()
    };
    this.errors.push(item);
    metricsRegistry.incrementCounter('errors_total', 1, { source });
  }

  getErrors(): ErrorRecord[] {
    return [...this.errors];
  }
}

export const errorReporter = new ErrorReporter();
// Auto start on bundle initialize
errorReporter.start();
