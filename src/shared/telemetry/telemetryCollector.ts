import type { TelemetryEvent } from './telemetryTypes';
import { eventBus } from '../platform/eventBus';
import { metricsRegistry } from './metricsRegistry';

export class TelemetryCollector {
  private events: TelemetryEvent[] = [];

  constructor() {
    this.registerEventBusListeners();
  }

  private registerEventBusListeners(): void {
    const domainEvents = [
      'user:login',
      'user:logout',
      'task:created',
      'task:completed',
      'intern:assigned',
      'evaluation:approved'
    ] as const;

    domainEvents.forEach((evt) => {
      eventBus.subscribe(evt as any, (payload) => {
        this.recordEvent(evt, payload);
      });
    });
  }

  recordEvent(eventName: string, payload: any): void {
    const item: TelemetryEvent = {
      id: 'te-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      eventName,
      payload,
      timestamp: new Date().toISOString()
    };
    this.events.push(item);
    metricsRegistry.incrementCounter(`event_${eventName}`, 1);
  }

  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }
}

export const telemetryCollector = new TelemetryCollector();
