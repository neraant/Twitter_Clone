'use client';

import {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import useSWRInfinite from 'swr/infinite';

import { Post } from '@/entities/post';
import { getUserPostsPaginated } from '@/entities/post/api/getUserPostsPaginated';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';
import { useToast } from '@/shared/lib/toast';

import { NO_POSTS } from '../lib';
import styles from './PostsList.module.scss';
import { PostsListSkeleton } from './PostsListSkeleton';

type PostsListProps = {
  userId: string;
  ref: RefObject<{ refreshPosts: () => void } | null>;
};

type ReturnDataType = {
  data: Post[];
  hasMore: boolean;
  nextCursor: number | null;
};

export const PostsList = ({ userId, ref }: PostsListProps) => {
  const lastRef = useRef<HTMLDivElement | null>(null);

  const { showToast } = useToast();

  const getKey = useCallback(
    (pageIndex: number, previousPageData: ReturnDataType) => {
      if (pageIndex > 0 && previousPageData && !previousPageData.hasMore) {
        return null;
      }

      if (pageIndex === 0) {
        return `posts-${userId}-page-0`;
      }

      const cursor = previousPageData?.nextCursor;
      if (!cursor) return null;

      return `posts-${userId}-page-${pageIndex}-cursor-${cursor}`;
    },
    [userId],
  );

  const fetcher = useCallback(
    async (key: string) => {
      const cursorMatch = key.match(/cursor-(.+)$/);
      const cursor = cursorMatch ? cursorMatch[1] : null;

      try {
        return await getUserPostsPaginated(userId, cursor);
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    [userId],
  );

  const { data, error, setSize, mutate, isValidating, isLoading } =
    useSWRInfinite(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    });

  useImperativeHandle(ref, () => ({
    refreshPosts: () => {
      mutate();
    },
  }));

  const posts = useMemo(() => {
    return data ? data.flatMap((page) => page.data || []) : [];
  }, [data]);

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

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isValidating, loadMore]);

  useEffect(() => {
    if (error) {
      console.error('PostsList error:', error);
      showToast('Error', 'Tweets loading failure!', 'error');
    }
  }, [error, showToast]);

  if (isLoading) {
    return <PostsListSkeleton />;
  }

  return (
    <div className={styles.postsContainer}>
      <ul className={styles.postsList}>
        {posts.map((post: Post) => (
          <li key={post.id}>
            <PostCard {...post} />
          </li>
        ))}
      </ul>

      <div ref={lastRef} className={styles.loadingTrigger} />

      {isLoadingMore && <PostsListSkeleton />}

      {posts.length === 0 && !isLoading && (
        <div className={styles.noPosts}>{NO_POSTS}</div>
      )}
    </div>
  );
};
