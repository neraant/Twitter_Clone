'use client';

import { Post, PostFetchingMode } from '@/entities/post';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';

import { NO_POSTS, usePosts } from '../lib';
import styles from './PostsList.module.scss';
import { PostsListSkeleton } from './PostsListSkeleton';

type PostsListProps = {
  userId?: string;
  currentUserId: string;
  mode?: PostFetchingMode;
};

export const PostsList = ({
  userId,
  currentUserId,
  mode = PostFetchingMode.user,
}: PostsListProps) => {
  const { posts, isLoading, isLoadingMore, lastRef } = usePosts({
    userId,
    mode,
  });

  if (isLoading) {
    return <PostsListSkeleton />;
  }

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
        {posts.map((post: Post, index) => (
          <li key={post.id}>
            <PostCard
              post={post}
              currentUserId={currentUserId}
              isFirst={index === 0}
            />
          </li>
        ))}
      </ul>

      <div ref={lastRef} className={styles.loadingTrigger} />

      {isLoadingMore && <PostsListSkeleton />}
    </div>
  );
};
