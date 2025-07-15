'use client';

import { useToastContext } from './ToastContext';

export const useToast = () => {
  const { showToast } = useToastContext();
  return { showToast };
};
