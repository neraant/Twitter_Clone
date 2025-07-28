import { UseMutationOptions } from '@tanstack/react-query';

import { CallbacksParams, MutationResult } from '../model';

export const createMutationCallbacks = ({
  queryClient,
  queryKey,
  showToast,
  successMessage,
  errorMessage,
  optimisticValue,
  revertValue,
}: CallbacksParams): UseMutationOptions<MutationResult, Error, void> => ({
  onMutate: async (): Promise<void> => {
    await queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData(queryKey, optimisticValue);
  },
  onSuccess: () => {
    showToast('Success', successMessage, 'success');
    queryClient.invalidateQueries({ queryKey });
  },
  onError: () => {
    showToast('Error', errorMessage, 'error');
    queryClient.setQueryData(queryKey, revertValue);
  },
});
