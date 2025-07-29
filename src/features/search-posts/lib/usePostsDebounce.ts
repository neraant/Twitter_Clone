'use client';

import { useEffect } from 'react';

import { DEBOUNCE_MS } from './searchPosts.constants';

type usePostsDebounceProps = {
  fetch: (value: string) => void;
  value: string;
  setLoading?: (loading: boolean) => void;
};

export const usePostsDebounce = ({
  fetch,
  value,
  setLoading,
}: usePostsDebounceProps) => {
  useEffect(() => {
    if (value.trim() !== '' && setLoading) {
      setLoading(true);
    }

    const timeoutId = setTimeout(() => {
      if (value.trim() !== '') {
        fetch(value);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, setLoading]);
};
