import { ChangeEvent, useEffect, useState } from 'react';

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
    const formatted = input.length < 4 ? '+375' : formatPhoneNumber(input);

    if (formatted.length <= 19) {
      setDisplayValue(formatted);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      };
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
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

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
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
