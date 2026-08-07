import { provide, inject } from 'vue';
import type { UseFormReturn } from './formEngine';

export const FORM_KEY = Symbol('GENERIC_FORM_CONTEXT');

export function provideFormContext(form: UseFormReturn<any>): void {
  provide(FORM_KEY, form);
}

export function useFormContext<T extends Record<string, any> = Record<string, any>>(): UseFormReturn<T> | undefined {
  return inject<UseFormReturn<T>>(FORM_KEY);
}
