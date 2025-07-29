'use client';

import clsx from 'clsx';

import { EditProfileButton } from '@/features/edit-profile-button';
import { FollowButton } from '@/features/follow-button/ui';

import styles from './ProfileAction.module.scss';

type ProfileActionProps = {
  className?: string;
  isOwner: boolean;
  currentUserId?: string;
  targetUserId?: string;
  onEditClick?: () => void;
};

export const ProfileAction = ({
  className,
  isOwner,
  currentUserId,
  targetUserId,
  onEditClick,
}: ProfileActionProps) => {
  if (!currentUserId || !targetUserId) return null;

  return (
    <div className={clsx(styles.action, className)}>
      {!isOwner ? (
        <FollowButton
          targetUserId={targetUserId}
          currentUserId={currentUserId}
        />
      ) : (
        <EditProfileButton onClick={onEditClick} />
      )}
    </div>
  );
};
