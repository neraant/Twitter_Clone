'use client';

import { ChangeEvent, useState } from 'react';

import { usePostsDebounce } from '@/features/search-posts/lib';
import { Input } from '@/shared/ui/input/Input';

import { SEARCH_PLACEHOLDER } from '../lib';

interface PostSearchInputIsolatedProps {
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ExploreInput = ({
  onQueryChange,
  onSearch,
  onLoadingChange,
}: PostSearchInputIsolatedProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onQueryChange(value);
  };

  usePostsDebounce({
    fetch: () => onSearch(query),
    setLoading: onLoadingChange,
    value: query,
  });

  return (
    <Input
      placeholder={SEARCH_PLACEHOLDER}
      value={query}
      onChange={handleChange}
    />
  );
};
