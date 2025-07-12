'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

import {
  GetUserPostsPaginatedReturnType,
  PostFetchingMode,
} from '@/entities/post';
import { getAllPostsPaginated } from '@/entities/post/api/getAllPostsPaginated';
import { useToast } from '@/shared/lib/toast';

type UsePostsProps = {
  userId?: string;
  mode?: PostFetchingMode;
};

export const usePosts = ({
  userId,
  mode = PostFetchingMode.user,
}: UsePostsProps) => {
  const lastRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  const getKey = useCallback(
    (pageIndex: number, previousPageData: GetUserPostsPaginatedReturnType) => {
      if (pageIndex > 0 && previousPageData && !previousPageData.hasMore) {
        return null;
      }

      const cursor = previousPageData?.nextCursor;
      return pageIndex === 0
        ? 'posts-all-page-0'
        : `posts-all-page-${pageIndex}-cursor-${cursor}`;
    },
    [],
  );

  const fetcher = useCallback(async (key: string) => {
    const cursorMatch = key.match(/cursor-(.+)$/);
    const cursor = cursorMatch ? cursorMatch[1] : null;
    return await getAllPostsPaginated(cursor);
  }, []);

  const {
    data,
    error,
    setSize,
    isValidating,
    isLoading,
    mutate: mutatePage,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshInterval: 0,
  });

  const posts = useMemo(() => {
    const allPosts = data ? data.flatMap((page) => page.data || []) : [];

    if (mode === PostFetchingMode.all) {
      return allPosts;
    } else {
      return allPosts.filter((post) => post.author_id === userId);
    }
  }, [data, mode, userId]);

  const hasMore = useMemo(() => {
    return data?.[data.length - 1]?.hasMore ?? true;
  }, [data]);

  const isLoadingMore = useMemo(() => {
    return isValidating && data && data.length > 0;
  }, [isValidating, data]);

  const loadMore = useCallback(() => {
    if (!isValidating && hasMore && data) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [isValidating, hasMore, data, setSize]);

  const refreshPosts = useCallback(() => {
    mutatePage();
  }, [mutatePage]);

  useEffect(() => {
    const element = lastRef.current;
    if (!element || !hasMore || isValidating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isValidating, loadMore]);

  useEffect(() => {
    if (error) {
      console.error('Posts error:', error);
      showToast('Error', 'Tweets loading failure!', 'error');
    }
  }, [error, showToast]);

  return {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    lastRef,
    loadMore,
    refreshPosts,
  };
};
