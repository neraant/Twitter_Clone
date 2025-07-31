'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { DEBOUNCE_MS } from '@/features/search-posts/lib';
import { CrossIcon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input/Input';

import { SEARCH_PLACEHOLDER } from '../lib';
import styles from './ExploreInput.module.scss';

type PostSearchInputIsolatedProps = {
  query: string;
  onQueryChange: (q: string) => void;
};

export const ExploreInput = ({
  query,
  onQueryChange,
}: PostSearchInputIsolatedProps) => {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      onQueryChange(localQuery.trim());
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, onQueryChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery('');
    onQueryChange('');
  };

  return (
    <div className={styles.inputWrapper} data-testid='explore-input-wrapper'>
      <Input
        className={styles.exploreInput}
        placeholder={SEARCH_PLACEHOLDER}
        onChange={handleChange}
        value={localQuery}
        dataTestId='explore-input'
      />

      {localQuery.trim() && (
        <button
          type='button'
          aria-label='clear query'
          onClick={handleClear}
          className={styles.clearButton}
        >
          <CrossIcon />
        </button>
      )}
    </div>
  );
};
