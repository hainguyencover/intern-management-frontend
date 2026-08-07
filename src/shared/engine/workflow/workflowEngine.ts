import { ref, computed } from 'vue';
import type { WorkflowConfig, TransitionRule } from './workflowTypes';
import { evaluateGuards } from './workflowGuards';
import { WorkflowHistoryTracker } from './workflowHistory';
import { serializeToMermaid } from './workflowSerializer';
import { WorkflowDebugger } from './workflowDebugger';

export function createWorkflow<TState extends string, TEvent extends string, TContext = any>(
  config: WorkflowConfig<TState, TEvent, TContext>
) {
  const currentState = ref<TState>(config.initialState) as { value: TState };
  const context = ref<TContext>(config.context || ({} as TContext));
  const historyTracker = new WorkflowHistoryTracker<TState, TEvent>();

  const allowedEvents = computed(() => {
    const rules = config.transitions.filter((t) => t.from === currentState.value);
    return rules.map((t) => t.event);
  });

  function canTransition(event: TEvent): boolean {
    return allowedEvents.value.includes(event);
  }

  function findTransitionRule(event: TEvent): TransitionRule<TState, TEvent, TContext> | undefined {
    return config.transitions.find(
      (t) => t.from === currentState.value && t.event === event
    );
  }

  async function transition(event: TEvent, actor?: string, metadata?: any): Promise<boolean> {
    const startTime = performance.now();
    const rule = findTransitionRule(event);

    if (!rule) {
      WorkflowDebugger.logReject(config.id, currentState.value, String(event), 'Chuyển đổi không hợp lệ trong State Machine');
      return false;
    }

    // Evaluate guards
    const guardsPassed = await evaluateGuards(rule.guards, context.value);
    if (!guardsPassed) {
      WorkflowDebugger.logReject(config.id, currentState.value, String(event), 'Guard kiểm tra điều kiện thất bại');
      return false;
    }

    // Execute beforeTransition hook
    if (rule.beforeTransition) {
      await rule.beforeTransition(currentState.value, rule.to, event, context.value);
    }

    const previousState = currentState.value;
    currentState.value = rule.to;

    // Record history log
    historyTracker.record(previousState, rule.to, event, actor, metadata);

    // Execute afterTransition hook
    if (rule.afterTransition) {
      await rule.afterTransition(previousState, rule.to, event, context.value);
    }

    const duration = performance.now() - startTime;
    if (config.debug) {
      WorkflowDebugger.logTransition(config.id, previousState, rule.to, String(event), duration);
    }

    return true;
  }

  function getMermaidDiagram(): string {
    return serializeToMermaid(config);
  }

  return {
    currentState,
    context,
    allowedEvents,
    canTransition,
    transition,
    getHistory: () => historyTracker.getRecords(),
    getMermaidDiagram
  };
}

export type GenericWorkflowInstance<TState extends string, TEvent extends string, TContext = any> = ReturnType<
  typeof createWorkflow<TState, TEvent, TContext>
>;
