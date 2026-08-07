import type { WorkflowHistoryRecord } from './workflowTypes';

export class WorkflowHistoryTracker<TState extends string, TEvent extends string> {
  private history: WorkflowHistoryRecord<TState, TEvent>[] = [];

  record(from: TState, to: TState, event: TEvent, actor?: string, metadata?: any): WorkflowHistoryRecord<TState, TEvent> {
    const entry: WorkflowHistoryRecord<TState, TEvent> = {
      id: 'wf-log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      from,
      to,
      event,
      actor: actor || 'System',
      timestamp: new Date().toLocaleString(),
      metadata
    };
    this.history.unshift(entry);
    return entry;
  }

  getRecords(): WorkflowHistoryRecord<TState, TEvent>[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}
