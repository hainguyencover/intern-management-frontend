import { describe, it, expect, vi } from 'vitest';
import { ApplicationEventBus } from '../eventBus';

describe('eventBus (ApplicationEventBus)', () => {
  it('should publish events to subscribers', () => {
    const bus = new ApplicationEventBus();
    const handler = vi.fn();

    bus.subscribe('task:completed' as any, handler);
    bus.publish('task:completed' as any, { taskId: '123' });

    expect(handler).toHaveBeenCalledWith({ taskId: '123' });
  });

  it('should not notify unsubscribed handlers', () => {
    const bus = new ApplicationEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe('task:completed' as any, handler);
    unsubscribe();

    bus.publish('task:completed' as any, { taskId: '123' });
    expect(handler).not.toHaveBeenCalled();
  });
});
