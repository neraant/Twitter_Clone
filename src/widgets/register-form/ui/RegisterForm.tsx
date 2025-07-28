'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { SignButton, useAuthStore } from '@/features/auth';
import { routes } from '@/shared/config/routes';
import { useToast } from '@/shared/lib/toast/useToast';
import { DropDownList } from '@/shared/ui/dropdown-list/DropDownList';
import { TwitterLogoIcon } from '@/shared/ui/icon';
import { SignInput } from '@/shared/ui/sign-input';

import {
  AGE_BODY,
  AGE_TITLE,
  BUTTON_LABEL,
  PLACEHOLDERS,
  RegisterFormData,
  registerSchema,
  TITLE,
  USE_GOOGLE_LINK,
  useDateSelector,
} from '../lib';
import styles from './RegisterForm.module.scss';

export const RegisterForm = () => {
  const {
    selected,
    daysOptions,
    months,
    years,
    handleSelectDay,
    handleSelectMonth,
    handleSelectYear,
    formatDate,
  } = useDateSelector();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
    },
    mode: 'onSubmit',
  });
  const router = useRouter();

  const { showToast } = useToast();

  const signUpWithPassword = useAuthStore((state) => state.signUpWithPassword);
  const isLoading = useAuthStore((state) => state.isLoadingSignUp);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { birthDay: day, birthMonth: month, birthYear: year } = data;
      const dateOfBirth = formatDate({ day, month, year });

      await signUpWithPassword({
        password: data.password,
        name: data.name,
        phoneNumber: data.phone_number,
        email: data.email,
        dateOfBirth,
      });

      showToast('Success!', 'You are sign up successfully!', 'success');

      reset();
      router.replace(routes.auth.login);
    } catch (error) {
      console.error(error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        showToast('Error!', (error as Error).message, 'error');
      } else {
        showToast('Error!', 'Something went wrong!', 'error');
      }
    }
  };

  useEffect(() => {
    setValue('birthDay', selected.day);
    setValue('birthMonth', selected.month);
    setValue('birthYear', selected.year);

    if (selected.day && selected.month && selected.year) {
      trigger(['birthDay', 'birthMonth', 'birthYear']);
    }
  }, [selected.day, selected.month, selected.year, setValue, trigger]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TwitterLogoIcon className={styles.logo} width={48} height={48} />

      <h1 className={styles.title}>{TITLE}</h1>

      <div className={styles.inputWrapper}>
        <SignInput
          {...register('name')}
          placeholder={PLACEHOLDERS.NAME}
          error={errors.name}
        />

        <SignInput
          {...register('phone_number')}
          placeholder={PLACEHOLDERS.PHONE}
          error={errors.phone_number}
          isPhone={true}
        />

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

        <SignInput
          {...register('confirmPassword')}
          placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
          error={errors.confirmPassword}
          isPassword
        />
      </div>

      <Link href={routes.auth.signUpMain} className={styles.useGoogleButton}>
        {USE_GOOGLE_LINK}
      </Link>

      <h4 className={styles.ageTitle}>{AGE_TITLE}</h4>
      <p className={styles.ageText}>{AGE_BODY}</p>

      <div className={styles.ageWrapper}>
        <input type='hidden' {...register('birthDay')} />
        <input type='hidden' {...register('birthMonth')} />
        <input type='hidden' {...register('birthYear')} />

        <div className={styles.ageWrapperBlock}>
          <DropDownList
            options={months}
            selected={selected.month}
            onSelect={handleSelectMonth}
            placeholder={PLACEHOLDERS.MONTH}
          />
          {errors.birthMonth && (
            <p className={styles.error}>{errors.birthMonth.message}</p>
          )}
        </div>

        <div className={styles.ageWrapperBlock}>
          <DropDownList
            options={daysOptions}
            selected={selected.day}
            onSelect={handleSelectDay}
            placeholder={PLACEHOLDERS.DAY}
          />
          {errors.birthDay && (
            <p className={styles.error}>{errors.birthDay.message}</p>
          )}
        </div>

        <div className={styles.ageWrapperBlock}>
          <DropDownList
            options={years}
            selected={selected.year}
            onSelect={handleSelectYear}
            placeholder={PLACEHOLDERS.YEAR}
          />
          {errors.birthYear && (
            <p className={styles.error}>{errors.birthYear.message}</p>
          )}
        </div>
      </div>

      <SignButton label={BUTTON_LABEL} isLoading={isLoading} />
    </form>
  );
};
