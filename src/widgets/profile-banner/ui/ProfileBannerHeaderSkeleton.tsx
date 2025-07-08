import { BackButton } from '@/shared/ui/back-button';
import { Skeleton } from '@/shared/ui/skeleton';

import styles from './ProfileBanner.module.scss';

export const ProfileBannerHeaderSkeleton = () => {
  return (
    <div className={styles.profileBannerWrapper}>
      <div className={styles.profileHeaderWrapper}>
        <BackButton />

        <div className={styles.wrapper}>
          <Skeleton width='140px' height='24px' />
          <Skeleton width='70px' height='20px' />
        </div>
      </div>

      <Skeleton className={styles.bannerImage} />
    </div>
  );
};
