import { QueryClient } from '@tanstack/react-query';

export type MutationResult = { success: boolean; error?: string };

export interface CallbacksParams {
  queryClient: QueryClient;
  queryKey: unknown[];
  showToast: (
    title: string,
    message: string,
    type: 'success' | 'error',
  ) => void;
  successMessage: string;
  errorMessage: string;
  optimisticValue: boolean;
  revertValue: boolean;
}
