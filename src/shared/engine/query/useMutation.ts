import { ref } from 'vue';
import { globalQueryCache } from './queryCache';

export interface MutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
  invalidateKeys?: string[];
}

export function useMutation<TData = any, TVariables = any>(options: MutationOptions<TData, TVariables>) {
  const loading = ref(false);
  const error = ref<any>(null);

  async function mutate(variables: TVariables): Promise<TData | null> {
    loading.value = true;
    error.value = null;
    try {
      const result = await options.mutationFn(variables);
      
      // Auto-invalidate associated query cache keys
      if (options.invalidateKeys && options.invalidateKeys.length) {
        for (const keyPrefix of options.invalidateKeys) {
          globalQueryCache.invalidateQueries(keyPrefix);
        }
      }

      if (options.onSuccess) {
        options.onSuccess(result, variables);
      }
      return result;
    } catch (err: any) {
      error.value = err?.message || 'Có lỗi xảy ra khi thực hiện thao tác.';
      if (options.onError) {
        options.onError(err, variables);
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    mutate,
    loading,
    error
  };
}
