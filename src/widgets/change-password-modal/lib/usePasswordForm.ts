import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { changePasswordSchema } from './changePasswordModal.schema';

export const usePasswordForm = (isEmailUser: boolean | null) => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema, { context: { isEmailUser } }),
    defaultValues: {
      currentPassword: '',
      changePassword: '',
      confirmPassword: '',
    },
  });

  return {
    errors,
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
  };
};
