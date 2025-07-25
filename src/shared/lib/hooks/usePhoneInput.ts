'use client';

import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';

const PHONE_PREFIX = '+375';
const MAX_PHONE_LENGTH = 19;
const MIN_CURSOR_POSITION = PHONE_PREFIX.length;

const formatPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '');

  if (digits.length <= 3) return PHONE_PREFIX;

  let formatted = PHONE_PREFIX;

  const operatorCode = digits.substring(3, 5);
  formatted += `(${operatorCode}`;

  if (digits.length <= 5) return formatted;

  formatted += ')';

  const firstPart = digits.substring(5, 8);
  formatted += `-${firstPart}`;

  if (digits.length <= 8) return formatted;

  const secondPart = digits.substring(8, 10);
  formatted += `-${secondPart}`;

  if (digits.length <= 10) return formatted;

  const finalPart = digits.substring(10, 12);
  formatted += `-${finalPart}`;

  return formatted;
};

export const usePhoneInput = (
  externalValue: string | number | undefined | readonly string[],
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
  const [displayValue, setDisplayValue] = useState(
    externalValue?.toString() || '',
  );

  useEffect(() => {
    if (externalValue !== undefined) {
      setDisplayValue(externalValue.toString());
    }
  }, [externalValue]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted =
      input.length < PHONE_PREFIX.length
        ? PHONE_PREFIX
        : formatPhoneNumber(input);

    if (formatted.length <= MAX_PHONE_LENGTH) {
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

  const handlePhoneFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!displayValue) {
      setDisplayValue(PHONE_PREFIX);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: PHONE_PREFIX,
        },
      };
      onChange?.(syntheticEvent);
    }

    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      if (
        target.selectionStart &&
        target.selectionStart < MIN_CURSOR_POSITION
      ) {
        target.setSelectionRange(MIN_CURSOR_POSITION, MIN_CURSOR_POSITION);
      }
    }, 0);
  };

  const handlePhoneKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      cursorPosition <= MIN_CURSOR_POSITION
    ) {
      e.preventDefault();
    }
  };

  return {
    displayValue,
    handlePhoneChange,
    handlePhoneFocus,
    handlePhoneKeyDown,
  };
};
