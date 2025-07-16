'use client';

import { ChangeEvent, useState } from 'react';

import { usePostsDebounce } from '@/features/search-posts/lib';
import { CrossIcon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input/Input';

import { SEARCH_PLACEHOLDER } from '../lib';
import styles from './ExploreInput.module.scss';

type PostSearchInputIsolatedProps = {
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onLoadingChange: (loading: boolean) => void;
};

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

  const handleRemoveQuery = () => {
    setQuery('');
    onQueryChange('');
  };

  usePostsDebounce({
    fetch: () => onSearch(query),
    setLoading: onLoadingChange,
    value: query,
  });

  return (
    <div className={styles.inputWrapper}>
      <Input
        className={styles.exploreInput}
        placeholder={SEARCH_PLACEHOLDER}
        onChange={handleChange}
        value={query}
      />

      {query.trim() && (
        <button
          type='button'
          aria-label='clear query'
          onClick={handleRemoveQuery}
          className={styles.clearButton}
        >
          <CrossIcon />
        </button>
      )}
    </div>
  );
};
