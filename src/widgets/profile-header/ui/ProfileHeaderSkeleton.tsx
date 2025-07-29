import { UserBigCardSkeleton } from '@/entities/user/ui/UserBigCard/UserBigCardSkeleton';
import { Skeleton } from '@/shared/ui/skeleton';

import styles from './ProfileHeader.module.scss';

export const ProfileHeaderSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <UserBigCardSkeleton className={styles.userCard} />

        <Skeleton width='140px' height='47px' className={styles.hideUnder768} />
      </div>
    </div>
  );
};
