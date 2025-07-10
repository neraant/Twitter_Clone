import clsx from 'clsx';

import { Skeleton } from '@/shared/ui/skeleton';

import { UserSmallCardProps } from './UserSmallCard';
import styles from './UserSmallCard.module.scss';

export const UserSmallCardSkeleton = ({ className }: UserSmallCardProps) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <Skeleton
        width='50px'
        height='50px'
        radius='50%'
        className={styles.icon}
      />

      <div className={styles.userInfo}>
        <Skeleton
          className={styles.name}
          width='100px'
          height='21px'
          radius='7px'
        />
        <Skeleton
          className={styles.subname}
          width='60px'
          height='17px'
          radius='7px'
        />
      </div>
    </div>
  );
};
