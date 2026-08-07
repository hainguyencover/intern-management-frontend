import { ref, computed } from 'vue';
import type { ZodSchema } from 'zod';

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  beforeSubmit?: (values: T) => boolean | Promise<boolean>;
  afterSubmit?: (values: T) => void;
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const initialValues = ref<T>({ ...options.initialValues });
  const values = ref<T>({ ...options.initialValues });
  const errors = ref<Record<string, string>>({});
  const touched = ref<Record<string, boolean>>({});
  const isSubmitting = ref(false);

  const isDirty = computed(() => {
    return JSON.stringify(values.value) !== JSON.stringify(initialValues.value);
  });

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  function setFieldValue<K extends keyof T>(field: K, val: T[K]) {
    values.value[field] = val;
    touched.value[field as string] = true;
    validateField(field);
  }

  function setValues(newValues: Partial<T>) {
    values.value = { ...values.value, ...newValues };
    validate();
  }

  function validateField<K extends keyof T>(field: K): boolean {
    if (!options.validationSchema) return true;
    const result = options.validationSchema.safeParse(values.value);
    if (!result.success) {
      const formatted = result.error.format();
      const fieldError = (formatted as any)[field]?._errors[0];
      if (fieldError) {
        errors.value[field as string] = fieldError;
      } else {
        delete errors.value[field as string];
      }
    } else {
      delete errors.value[field as string];
    }
    return !errors.value[field as string];
  }

  function validate(): boolean {
    if (!options.validationSchema) {
      errors.value = {};
      return true;
    }
    const result = options.validationSchema.safeParse(values.value);
    if (!result.success) {
      const formatted = result.error.format();
      const newErrors: Record<string, string> = {};
      Object.keys(formatted).forEach((key) => {
        if (key !== '_errors') {
          const err = (formatted as any)[key]?._errors[0];
          if (err) newErrors[key] = err;
        }
      });
      errors.value = newErrors;
      return false;
    }
    errors.value = {};
    return true;
  }

  function resetForm(customInitialValues?: T) {
    const resetVals = customInitialValues || initialValues.value;
    values.value = { ...resetVals };
    errors.value = {};
    touched.value = {};
    isSubmitting.value = false;
  }

  async function handleSubmit() {
    if (!validate()) return;

    if (options.beforeSubmit) {
      const canProceed = await options.beforeSubmit(values.value);
      if (!canProceed) return;
    }

    isSubmitting.value = true;
    try {
      await options.onSubmit(values.value);
      if (options.afterSubmit) {
        options.afterSubmit(values.value);
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    values,
    initialValues,
    errors,
    touched,
    isDirty,
    isValid,
    isSubmitting,
    setFieldValue,
    setValues,
    validateField,
    validate,
    resetForm,
    handleSubmit
  };
}

export type UseFormReturn<T extends Record<string, any>> = ReturnType<typeof useForm<T>>;
