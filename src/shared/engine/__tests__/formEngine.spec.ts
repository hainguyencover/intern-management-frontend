import { describe, it, expect } from 'vitest';
import { useForm } from '../formEngine';
import { z } from 'zod';

describe('formEngine (useForm)', () => {
  const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 chars'),
    email: z.string().email('Invalid email')
  });

  it('should initialize with initial values', () => {
    const form = useForm({
      initialValues: { username: 'test', email: 'test@example.com' },
      validationSchema: schema,
      onSubmit: async () => {}
    });

    expect(form.values.value.username).toBe('test');
    expect(form.values.value.email).toBe('test@example.com');
    expect(form.isValid.value).toBe(true);
  });

  it('should validate correctly and set errors', async () => {
    const form = useForm({
      initialValues: { username: 'ab', email: 'invalid-email' },
      validationSchema: schema,
      onSubmit: async () => {}
    });

    await form.submitForm();
    expect(form.errors.value.username).toBe('Username must be at least 3 chars');
    expect(form.errors.value.email).toBe('Invalid email');
    expect(form.isValid.value).toBe(false);
  });
});
