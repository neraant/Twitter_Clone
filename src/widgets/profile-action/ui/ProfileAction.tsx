'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { EditProfileButton } from '@/features/edit-profile-button';
import { FollowButton } from '@/features/follow-button/ui';
import { routes } from '@/shared/config/routes';
import { MessagesIcon } from '@/shared/ui/icon';

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
        <div className={styles.profileAcions}>
          <FollowButton
            targetUserId={targetUserId}
            currentUserId={currentUserId}
          />
          <Link
            href={`${routes.app.messages}/${targetUserId}`}
            aria-label='send message to a user'
            className={styles.sendMessage}
          >
            <MessagesIcon width={24} height={24} />
          </Link>
        </div>
      ) : (
        <EditProfileButton onClick={onEditClick} />
      )}
    </div>
  );
};
