import clsx from 'clsx';

import { Skeleton } from '@/shared/ui/skeleton';

import { UserBigCardProps } from './UserBigCard';
import styles from './UserBigCard.module.scss';

export const UserBigCardSkeleton = ({ className }: UserBigCardProps) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <Skeleton
        width='180px'
        height='180px'
        radius='180px'
        className={styles.icon}
      />

      <div className={styles.userInfo}>
        <Skeleton width='120px' height='26px' />
        <Skeleton width='90px' height='20px' />
      </div>

      <Skeleton width='350px' height='21px' />
    </div>
  );
};
