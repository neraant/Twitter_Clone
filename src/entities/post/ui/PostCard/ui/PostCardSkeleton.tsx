import { Skeleton } from '@/shared/ui/skeleton';

import styles from './PostCard.module.scss';

export const PostCardSkeleton = () => {
  return (
    <article className={styles.postCard}>
      <Skeleton
        width='50px'
        height='50px'
        radius='50%'
        className={styles.userIcon}
      />

      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <Skeleton
            width='200px'
            height='21px'
            className={styles.postAuthorName}
          />
        </div>

        <Skeleton height='100px' className={styles.postContentText} />
      </div>
    </article>
  );
};
