export type GuardFn<TContext = any> = (context: TContext) => boolean | Promise<boolean>;

export type LifecycleHookFn<TState = string, TEvent = string, TContext = any> = (
  from: TState,
  to: TState,
  event: TEvent,
  context: TContext
) => void | Promise<void>;

export interface TransitionRule<TState extends string, TEvent extends string, TContext = any> {
  from: TState;
  event: TEvent;
  to: TState;
  guards?: GuardFn<TContext>[];
  beforeTransition?: LifecycleHookFn<TState, TEvent, TContext>;
  afterTransition?: LifecycleHookFn<TState, TEvent, TContext>;
}

export interface WorkflowConfig<TState extends string, TEvent extends string, TContext = any> {
  id: string;
  initialState: TState;
  transitions: TransitionRule<TState, TEvent, TContext>[];
  context?: TContext;
  debug?: boolean;
}

export interface WorkflowHistoryRecord<TState = string, TEvent = string> {
  id: string;
  from: TState;
  to: TState;
  event: TEvent;
  actor?: string;
  timestamp: string;
  metadata?: any;
}
