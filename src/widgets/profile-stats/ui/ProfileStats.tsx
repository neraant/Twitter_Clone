import { User } from '@/entities/user';
import { Skeleton } from '@/shared/ui/skeleton';
import { ProfileAction } from '@/widgets/profile-action';

import { FOLLOWER, FOLLOWERS, FOLLOWING } from '../lib';
import styles from './ProfileStats.module.scss';

interface ProfileBannerProps {
  user: User;
  isLoading: boolean;
  isOwner: boolean;
  onEditProfileClick: () => void;
}

export const ProfileStats = ({
  user,
  isLoading = false,
  isOwner = false,
  onEditProfileClick,
}: ProfileBannerProps) => {
  const FOLLOWER_TEXT = user?.followers_count === 1 ? FOLLOWER : FOLLOWERS;

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsWrapper}>
        {isLoading ? (
          <>
            <Skeleton width='100px' height='21px' />
            <Skeleton width='100px' height='21px' />
          </>
        ) : (
          <>
            <span className={styles.statsText}>
              {user?.followers_count || 0} <span>{FOLLOWER_TEXT}</span>
            </span>
            <span className={styles.statsText}>
              {user?.following_count || 0} <span>{FOLLOWING}</span>
            </span>
          </>
        )}
      </div>

      <ProfileAction
        isOwner={isOwner}
        userId={user.id}
        onEditProfileClick={onEditProfileClick}
      />
    </div>
  );
};
