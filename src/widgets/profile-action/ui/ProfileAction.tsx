'use client';

import clsx from 'clsx';

import { EditProfileButton } from '@/features/edit-profile-button';
import { FollowButton } from '@/features/follow-button/ui';
import { useProfileStore } from '@/widgets/profile-client/model';

import styles from './ProfileAction.module.scss';

type ProfileActionProps = {
  className?: string;
};

export const ProfileAction = ({ className }: ProfileActionProps) => {
  const isOwner = useProfileStore((state) => state.isOwner);
  const isInitialFollow = useProfileStore((state) => state.isInitialFollow);
  const currentUserId = useProfileStore((state) => state.currentUserId);
  const targetUserId = useProfileStore((state) => state.user?.id);
  const openEditModal = useProfileStore((state) => state.openEditModal);

  if (!currentUserId || !targetUserId) return null;

  return (
    <div className={clsx(styles.action, className)}>
      {!isOwner ? (
        <FollowButton
          isInitialFollow={isInitialFollow}
          targetUserId={targetUserId}
          currentUserId={currentUserId}
        />
      ) : (
        <EditProfileButton onClick={openEditModal} />
      )}
    </div>
  );
};
