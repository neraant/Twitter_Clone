'use client';

import {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
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

export const PostsList = ({ userId, ref }: PostsListProps) => {
  const lastRef = useRef<HTMLDivElement | null>(null);

  const { showToast } = useToast();

  const { data, error, size, setSize, mutate, isValidating, isLoading } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data?.length) return null;

        if (pageIndex === 0) return `posts-${userId}-page-0`;

        const cursor = previousPageData?.nextCursor;
        if (!cursor) return null;

        return `posts-${userId}-page-${pageIndex}-cursor-${cursor}`;
      },
      async (key) => {
        const cursorMatch = key.match(/cursor-(.+)$/);
        const cursor = cursorMatch ? cursorMatch[1] : null;

        return getUserPostsPaginated(userId, cursor);
      },
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        refreshInterval: 0,
      },
    );

  useImperativeHandle(ref, () => ({
    refreshPosts: () => {
      mutate();
    },
  }));

  const posts = data ? data.flatMap((page) => page.data || []) : [];
  const hasMore = data?.[data.length - 1]?.hasMore ?? true;
  const isLoadingMore = isValidating && data && data.length > 0;

  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) {
      setSize(size + 1);
    }
  }, [size, setSize, isValidating, hasMore]);

  useEffect(() => {
    if (!lastRef.current || !hasMore || isValidating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const element = lastRef.current;
    observer.observe(element);

    return () => observer.disconnect();
  }, [loadMore, hasMore, isValidating]);

  if (error) {
    showToast('Error', 'Tweets loading failure!', 'error');
  }

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
