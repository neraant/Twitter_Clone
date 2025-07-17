'use client';

import { Post } from '@/entities/post';
import { POSTS_LIMIT, usePosts } from '@/entities/post/lib';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';

import { ERROR_POSTS, NO_POSTS } from '../lib';
import styles from './PostsList.module.scss';
import { PostsListSkeleton } from './PostsListSkeleton';

type PostsListProps = {
  userId?: string;
  currentUserId: string;
};

export const PostsList = ({ userId, currentUserId }: PostsListProps) => {
  const {
    posts,
    isLoading,
    lastRef,
    error,
    isLoadingMore,
    hasNextPage,
    likePost,
    unlikePost,
  } = usePosts(userId);

  if (isLoading) {
    return <PostsListSkeleton />;
  }

  if (error)
    return (
      <div className={styles.postsContainer}>
        <div className={styles.noPosts}>{ERROR_POSTS}</div>
      </div>
    );

  if (posts.length === 0 && !isLoading && !isLoadingMore) {
    return (
      <div className={styles.postsContainer}>
        <div className={styles.noPosts}>{NO_POSTS}</div>
      </div>
    );
  }

  return (
    <div className={styles.postsContainer}>
      <ul className={styles.postsList}>
        {posts.map((post: Post, index: number) => (
          <li key={post.id ?? index}>
            <PostCard
              post={post}
              currentUserId={currentUserId}
              isFirst={index === 0}
              likePost={likePost}
              unlikePost={unlikePost}
            />
          </li>
        ))}
      </ul>

      <div ref={lastRef} className={styles.loadingTrigger} />

      {isLoadingMore && hasNextPage && posts.length >= POSTS_LIMIT && (
        <PostsListSkeleton />
      )}
    </div>
  );
};
