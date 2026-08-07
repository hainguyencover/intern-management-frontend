import { describe, it, expect } from 'vitest';
import { createWorkflow } from '../workflow/workflowEngine';

describe('workflowEngine (createWorkflow)', () => {
  it('should define workflow states and trigger transition successfully', async () => {
    const workflow = createWorkflow<string, string, any>({
      initialState: 'DRAFT',
      transitions: {
        DRAFT: {
          submit: { target: 'SUBMITTED' }
        },
        SUBMITTED: {
          approve: { target: 'APPROVED' }
        }
      }
    });

    expect(workflow.state.value).toBe('DRAFT');

    const success = await workflow.send('submit');
    expect(success).toBe(true);
    expect(workflow.state.value).toBe('SUBMITTED');
  });

  it('should block transition if guard returns false', async () => {
    const workflow = createWorkflow<string, string, any>({
      initialState: 'DRAFT',
      transitions: {
        DRAFT: {
          submit: {
            target: 'SUBMITTED',
            guards: [() => false]
          }
        }
      }
    });

    const success = await workflow.send('submit');
    expect(success).toBe(false);
    expect(workflow.state.value).toBe('DRAFT');
  });
});
