'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isLoadingMore,
  fetchNextPage,
  threshold = 0.1,
  rootMargin = '0px',
  enabled = true,
}: UseInfiniteScrollProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !lastElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          fetchNextPage();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(lastElementRef.current);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isLoadingMore,
    threshold,
    rootMargin,
    enabled,
  ]);

  return { lastElementRef };
};
