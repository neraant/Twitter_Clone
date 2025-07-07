'use client';

import { User, UserBigCard } from '@/entities/user';
import { UserBigCardSkeleton } from '@/entities/user/ui/UserBigCard/UserBigCardSkeleton';
import { ProfileAction } from '@/widgets/profile-action';

import styles from './ProfileHeader.module.scss';

interface ProfileBannerProps {
  user?: User | null;
  isLoading?: boolean;
  isOwner?: boolean;
  onEditProfileClick: () => void;
}

export const ProfileHeader = ({
  user,
  isLoading = false,
  isOwner = true,
  onEditProfileClick,
}: ProfileBannerProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        {isLoading ? (
          <UserBigCardSkeleton />
        ) : (
          <UserBigCard user={user} className={styles.userCard} />
        )}

        <ProfileAction
          isOwner={isOwner}
          userId={user?.id}
          onEditProfileClick={onEditProfileClick}
        />
      </div>
    </div>
  );
};
