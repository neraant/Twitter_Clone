import { User } from '@/entities/user';
import { ProfileAction } from '@/widgets/profile-action';

import { FOLLOWER, FOLLOWERS, FOLLOWING } from '../lib';
import styles from './ProfileStats.module.scss';

type ProfileStatsProps = {
  user: User;
  isOwner: boolean;
  currentUserId: string;
  targetUserId: string;
  isInitialFollow: boolean;
};

export const ProfileStats = ({
  user,
  isOwner,
  currentUserId,
  targetUserId,
  isInitialFollow,
}: ProfileStatsProps) => {
  const FOLLOWER_TEXT = user.followers_count === 1 ? FOLLOWER : FOLLOWERS;

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsWrapper}>
        <span className={styles.statsText}>
          {user.followers_count || 0} <span>{FOLLOWER_TEXT}</span>
        </span>
        <span className={styles.statsText}>
          {user.following_count || 0} <span>{FOLLOWING}</span>
        </span>
      </div>

      <ProfileAction
        className={styles.hideAbove768}
        isOwner={isOwner}
        currentUserId={currentUserId}
        targetUserId={targetUserId}
        isInitialFollow={isInitialFollow}
      />
    </div>
  );
};
