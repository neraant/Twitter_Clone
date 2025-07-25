'use client';

import clsx from 'clsx';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { usePhoneInput } from '@/shared/lib/hooks/usePhoneInput';

import { EyeCrossedIcon } from '../../../shared/ui/icon';
import styles from './SignInput.module.scss';

type SignInputProps = {
  label?: string;
  placeholder?: string;
  isPassword?: boolean;
  isPhone?: boolean;
  error?: FieldError;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const SHOW_PASSWROD = 'Show password';
const HIDE_PASSWROD = 'Hide password';

/* eslint-disable react/display-name */
export const SignInput = forwardRef<HTMLInputElement, SignInputProps>(
  (
    {
      label,
      placeholder,
      isPassword = false,
      isPhone = false,
      error,
      onChange,
      value,
      className,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const {
      displayValue,
      handlePhoneChange,
      handlePhoneKeyDown,
      handlePhoneFocus,
    } = usePhoneInput(value, onChange);

    let inputType = 'text';

    if (isPassword) {
      inputType = showPassword ? 'text' : 'password';
    }

    const phoneHandlers = isPhone
      ? {
          onChange: handlePhoneChange,
          onKeyDown: handlePhoneKeyDown,
          onFocus: handlePhoneFocus,
          value: displayValue,
          maxLength: 19,
        }
      : {
          onChange,
          value,
        };

    return (
      <div className={clsx(styles.inputWrapper, className)}>
        {label && (
          <label htmlFor={label} className={styles.label}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
          id={label}
          {...phoneHandlers}
          {...props}
        />

        {isPassword && (
          <button
            type='button'
            className={`${styles.passwordButton} ${showPassword ? styles.active : ''}`}
            tabIndex={-1}
            onClick={handleShowPassword}
            aria-label={showPassword ? HIDE_PASSWROD : SHOW_PASSWROD}
          >
            <EyeCrossedIcon width={19} height={19} />
          </button>
        )}

        {error && <p className={styles.errorMessage}>{error.message}</p>}
      </div>
    );
  },
);
