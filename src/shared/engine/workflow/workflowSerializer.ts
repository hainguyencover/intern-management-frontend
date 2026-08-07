import type { WorkflowConfig } from './workflowTypes';

export function serializeToMermaid<TState extends string, TEvent extends string>(
  config: WorkflowConfig<TState, TEvent, any>
): string {
  const lines: string[] = ['stateDiagram-v2'];
  lines.push(`  [*] --> ${config.initialState}`);

  for (const t of config.transitions) {
    lines.push(`  ${t.from} --> ${t.to} : ${t.event}`);
  }

  return lines.join('\n');
}
