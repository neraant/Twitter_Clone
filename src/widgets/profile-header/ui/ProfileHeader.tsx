'use client';

import { UserBigCard } from '@/entities/user';
import { ProfileAction } from '@/widgets/profile-action';
import { useProfileStore } from '@/widgets/profile-client/model';

import styles from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
  const user = useProfileStore((state) => state.user);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <UserBigCard user={user} className={styles.userCard} />

        <ProfileAction className={styles.hideUnder768} />
      </div>
    </div>
  );
};
