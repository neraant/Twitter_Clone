'use client';

import { ChangeEvent, useEffect } from 'react';

import { useDebounce } from '@/shared/lib/hooks';
import { Input } from '@/shared/ui/input/Input';

import { DEBOUNCE_MS, SEARCH_PLACEHOLDER } from '../lib';
import { useSearchPostsStore } from '../model';

export const PostSearchInput = () => {
  const setQuery = useSearchPostsStore((state) => state.setQuery);
  const search = useSearchPostsStore((state) => state.search);
  const query = useSearchPostsStore((state) => state.query);

  const { debouncedValue } = useDebounce(query, DEBOUNCE_MS);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue, search]);

  return (
    <Input
      placeholder={SEARCH_PLACEHOLDER}
      value={query}
      onChange={handleChange}
    />
  );
};
