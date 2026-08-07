export class WorkflowDebugger {
  static logTransition(workflowId: string, from: string, to: string, event: string, durationMs: number): void {
    if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
      console.group(`[Workflow Debugger: ${workflowId}]`);
      console.log(`Transition: ${from} ---> (${event}) ---> ${to}`);
      console.log(`Duration: ${durationMs.toFixed(2)}ms`);
      console.groupEnd();
    }
  }

  static logReject(workflowId: string, from: string, event: string, reason: string): void {
    if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
      console.warn(`[Workflow Debugger: ${workflowId}] Transition REJECTED from ${from} via event ${event}: ${reason}`);
    }
  }
}
