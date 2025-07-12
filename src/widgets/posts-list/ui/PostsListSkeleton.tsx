import { PostCardSkeleton } from '@/entities/post/ui/PostCard/ui/PostCardSkeleton';

import styles from './PostsList.module.scss';

export const SKELETON_COUNT = 5;

export const PostsListSkeleton = () => {
  return (
    <div className={styles.postsContainer}>
      <ul className={styles.postsList}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
};
