import { Skeleton } from '@/shared/ui/skeleton';

import styles from './ProfileStats.module.scss';

export const ProfileStatsSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.statsWrapper}>
        <span className={styles.statsText}>
          <Skeleton width='100px' height='21px' />
        </span>
        <span className={styles.statsText}>
          <Skeleton width='100px' height='21px' />
        </span>
      </div>

      <Skeleton height='37px' className={styles.skeletonButton} />
    </div>
  );
};
