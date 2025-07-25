import { UserSmallCardSkeleton } from '@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton';
import { Skeleton } from '@/shared/ui/skeleton';

import { TITLE } from '../lib';
import styles from './YouMightLike.module.scss';

const SKELETON_COUNT = 3;

export const YouMightLikeSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{TITLE}</p>

      <div className={styles.users}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <UserSmallCardSkeleton key={i} />
        ))}
      </div>

      <Skeleton width='90px' height='20px' />
    </div>
  );
};
