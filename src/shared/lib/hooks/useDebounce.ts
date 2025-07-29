'use client';

import { useEffect, useState } from 'react';

export const useDebounce = (value: string, milliseconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, milliseconds);

    return () => {
      clearTimeout(id);
    };
  }, [value, milliseconds]);

  return { debouncedValue };
};
