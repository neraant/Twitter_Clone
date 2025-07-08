import { ProfileAction } from '@/widgets/profile-action';
import { useProfileStore } from '@/widgets/profile-client/model';

import { FOLLOWER, FOLLOWERS, FOLLOWING } from '../lib';
import styles from './ProfileStats.module.scss';

export const ProfileStats = () => {
  const user = useProfileStore((state) => state.user);

  const FOLLOWER_TEXT = user?.followers_count === 1 ? FOLLOWER : FOLLOWERS;

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsWrapper}>
        <span className={styles.statsText}>
          {user?.followers_count || 0} <span>{FOLLOWER_TEXT}</span>
        </span>
        <span className={styles.statsText}>
          {user?.following_count || 0} <span>{FOLLOWING}</span>
        </span>
      </div>

      <ProfileAction className={styles.hideAbove768} />
    </div>
  );
};
