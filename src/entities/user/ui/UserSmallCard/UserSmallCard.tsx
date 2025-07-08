import DefaultAvatar from '@assets/images/user-avatar.png';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { FollowButton } from '@/features/follow-button/ui';
import { routes } from '@/shared/config/routes';

import { User } from '../../model';
import styles from './UserSmallCard.module.scss';

type UserForProps = Pick<User, 'id' | 'name' | 'avatar_url' | 'user_telegram'>;

export type UserSmallCardProps = {
  className?: string;
  user?: UserForProps | null;
  isOwnProfile?: boolean;
  isFollowed?: boolean;
  currentUserId?: string;
};

export const UserSmallCard = ({
  user,
  className,
  isOwnProfile = false,
  isFollowed,
  currentUserId,
}: UserSmallCardProps) => {
  if (!user) return null;

  const { avatar_url, name, id, user_telegram } = user;
  const url = isOwnProfile ? routes.app.profile : `${routes.app.profile}/${id}`;
  const showFollowButton =
    !isOwnProfile && currentUserId && currentUserId !== user.id;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Link href={url} className={styles.wrapper}>
        <Image
          src={avatar_url || DefaultAvatar}
          alt='avatar'
          width={50}
          height={50}
          className={styles.icon}
          priority
        />

        <div className={styles.userInfo}>
          <span className={styles.name} title={name!}>
            {name}
          </span>
          <span className={styles.subname}>{user_telegram}</span>
        </div>
      </Link>

      {showFollowButton && (
        <FollowButton
          targetUserId={user.id}
          isInitialFollow={isFollowed ?? false}
          currentUserId={currentUserId!}
        />
      )}
    </div>
  );
};
