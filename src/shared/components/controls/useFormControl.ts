import { computed } from 'vue';
import { useFormContext } from '../../engine/formContext';

export function useFormControl(name?: string, fallbackValue?: any, fallbackError?: string) {
  const form = useFormContext();

  const value = computed({
    get() {
      if (form && name) {
        return form.values.value[name] ?? fallbackValue;
      }
      return fallbackValue;
    },
    set(newVal: any) {
      if (form && name) {
        form.setFieldValue(name, newVal);
      }
    }
  });

  const error = computed(() => {
    if (form && name) {
      return form.errors.value[name];
    }
    return fallbackError;
  });

  return {
    value,
    error,
    form
  };
}
