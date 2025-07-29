'use client';

import { User } from '@/entities/user';
import { UserBigCard } from '@/entities/user';
import { ProfileAction } from '@/widgets/profile-action';

import styles from './ProfileHeader.module.scss';

type ProfileHeaderProps = {
  user: User;
  isOwner: boolean;
  currentUserId: string;
  onEditClick: () => void;
};

export const ProfileHeader = ({
  user,
  isOwner,
  currentUserId,
  onEditClick,
}: ProfileHeaderProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <UserBigCard user={user} className={styles.userCard} />
        <ProfileAction
          className={styles.hideUnder768}
          isOwner={isOwner}
          onEditClick={onEditClick}
          currentUserId={currentUserId}
          targetUserId={user.id}
        />
      </div>
    </div>
  );
};
