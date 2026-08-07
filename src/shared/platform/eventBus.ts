export interface AppEventMap {
  'user:login': { userId: string; role: string };
  'user:logout': { userId: string };
  'task:created': { taskId: string; title: string; assigneeId: string };
  'task:completed': { taskId: string };
  'intern:assigned': { internId: string; mentorId: string };
  'evaluation:approved': { evaluationId: string; internId: string };
  'notification:published': { id: string; level: string; message: string };
}

type EventHandler<T> = (payload: T) => void;

export class ApplicationEventBus {
  private handlers = new Map<string, Set<EventHandler<any>>>();

  subscribe<K extends keyof AppEventMap>(event: K, handler: EventHandler<AppEventMap[K]>): () => void {
    const eventName = String(event);
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventName)?.delete(handler);
    };
  }

  publish<K extends keyof AppEventMap>(event: K, payload: AppEventMap[K]): void {
    const eventName = String(event);
    const set = this.handlers.get(eventName);
    if (set) {
      set.forEach((h) => {
        try {
          h(payload);
        } catch (err) {
          console.error(`[EventBus Error on ${eventName}]:`, err);
        }
      });
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new ApplicationEventBus();
