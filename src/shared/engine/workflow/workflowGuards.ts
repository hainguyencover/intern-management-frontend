import type { GuardFn } from './workflowTypes';

export async function evaluateGuards<TContext = any>(
  guards: GuardFn<TContext>[] | undefined,
  context: TContext
): Promise<boolean> {
  if (!guards || !guards.length) return true;

  for (const guard of guards) {
    try {
      const result = await guard(context);
      if (!result) return false;
    } catch {
      return false;
    }
  }
  return true;
}
