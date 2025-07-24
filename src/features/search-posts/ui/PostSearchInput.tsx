'use client';

import { ChangeEvent } from 'react';

import { Input } from '@/shared/ui/input/Input';

import { SEARCH_PLACEHOLDER, usePostsDebounce } from '../lib';
import { useSearchPostsStore } from '../model';

export const PostSearchInput = () => {
  const setQuery = useSearchPostsStore((state) => state.setQuery);
  const search = useSearchPostsStore((state) => state.search);
  const setLoading = useSearchPostsStore((state) => state.setLoading);
  const query = useSearchPostsStore((state) => state.query);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  usePostsDebounce({
    fetch: search,
    value: query,
    setLoading,
  });

  return (
    <Input
      placeholder={SEARCH_PLACEHOLDER}
      value={query}
      onChange={handleChange}
      dataTestId='search-input'
    />
  );
};
