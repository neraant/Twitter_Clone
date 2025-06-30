'use client';

import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { FieldError } from 'react-hook-form';

import { EyeCrossedIcon } from '../../../shared/ui/icon';
import styles from './SignInput.module.scss';

type SignInputProps = {
  placeholder?: string;
  isPassword?: boolean;
  isPhone?: boolean;
  error?: FieldError;
} & InputHTMLAttributes<HTMLInputElement>;

const SHOW_PASSWROD = 'Show password';
const HIDE_PASSWROD = 'Hide password';

/* eslint-disable react/display-name */
export const SignInput = forwardRef<HTMLInputElement, SignInputProps>(
  (
    {
      placeholder,
      isPassword = false,
      isPhone = false,
      error,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [displayValue, setDisplayValue] = useState(value?.toString() || '');

    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value.toString());
      }
    }, [value]);

    const handleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const formatPhoneNumber = (input: string) => {
      const digits = input.replace(/\D/g, '');

      let formatted = '+375';

      if (digits.length > 3) {
        const operatorCode = digits.substring(3, 5);
        formatted += `(${operatorCode}`;

        if (digits.length > 5) {
          formatted += ')';

          const firstPart = digits.substring(5, 8);
          formatted += `-${firstPart}`;

          if (digits.length > 8) {
            const secondPart = digits.substring(8, 10);
            formatted += `-${secondPart}`;

            if (digits.length > 10) {
              const finalPart = digits.substring(10, 12);
              formatted += `-${finalPart}`;
            }
          }
        }
      }

      return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      if (input.length < 4) {
        const formatted = '+375';
        setDisplayValue(formatted);

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        };
        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      const formatted = formatPhoneNumber(input);

      if (formatted.length <= 19) {
        setDisplayValue(formatted);

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        };
        onChange?.(syntheticEvent as ChangeEvent<HTMLInputElement>);
      }
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const cursorPosition = target.selectionStart || 0;

      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        cursorPosition <= 4
      ) {
        e.preventDefault();
      }
    };

    const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!displayValue) {
        const formatted = '+375';
        setDisplayValue(formatted);

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        };
        onChange?.(syntheticEvent);
      }

      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        if (target.selectionStart && target.selectionStart < 4) {
          target.setSelectionRange(4, 4);
        }
      }, 0);
    };

    const inputType = isPassword
      ? showPassword
        ? 'text'
        : 'password'
      : 'text';

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
      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
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

        {error && <span className={styles.errorMessage}>{error.message}</span>}
      </div>
    );
  },
);
