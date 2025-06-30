'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { SignButton, useAuth } from '@/features/auth';
import { routes } from '@/shared/config/routes';
import { useToast } from '@/shared/lib/toast/useToast';
import { TwitterLogoIcon } from '@/shared/ui/icon';
import { SignInput } from '@/shared/ui/sign-input';

import {
  BUTTON_LABEL,
  loginFormData,
  loginSchema,
  PLACEHOLDERS,
  SIGN_UP_LINK,
  TITLE,
} from '../lib';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();

  const { showToast } = useToast();

  const loginWithPassword = useAuth((state) => state.loginWithPassword);
  const isLoading = useAuth((state) => state.isLoading);

  const onSubmit = async (data: loginFormData) => {
    try {
      await loginWithPassword({
        email: data.email,
        password: data.password,
      });

      showToast('Success!', 'You are login successfully!', 'success');

      reset();
      router.replace(routes.app.home);
    } catch (error) {
      console.error(error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        showToast('Error!', (error as Error).message, 'error');
      } else {
        showToast('Error!', 'Something went wrong!', 'error');
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TwitterLogoIcon className={styles.logo} width={48} height={48} />

      <h1 className={styles.title}>{TITLE}</h1>

      <div className={styles.inputWrapper}>
        <SignInput
          {...register('email')}
          placeholder={PLACEHOLDERS.EMAIL}
          error={errors.email}
        />

        <SignInput
          {...register('password')}
          placeholder={PLACEHOLDERS.PASSWORD}
          error={errors.password}
          isPassword
        />
      </div>

      <SignButton label={BUTTON_LABEL} isLoading={isLoading} />

      <Link href={routes.auth.signUp} className={styles.signUp}>
        {SIGN_UP_LINK}
      </Link>
    </form>
  );
};
