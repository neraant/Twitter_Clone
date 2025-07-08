'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { UserSmallCard } from '@/entities/user';
import { User } from '@/entities/user/model/user.types';
import { useFollowStore } from '@/features/follow-button/model';

import {
  EMPTY_USERS_TEXT,
  ERROR_USERS_TEXT,
  SHOW_LESS_BUTTON,
  SHOW_MORE_BUTTON,
  TITLE,
} from '../lib';
import styles from './YouMightLike.module.scss';

type UserWithFollowStatus = User & { isFollowed: boolean };

interface YouMightLikeClientProps {
  initialUsers?: UserWithFollowStatus[];
  currentUserId?: string;
  isError?: boolean;
}

export const YouMightLikeClient = ({
  initialUsers,
  currentUserId,
  isError,
}: YouMightLikeClientProps) => {
  const [isMore, setIsMore] = useState(false);

  const { initializeFollowStatus } = useFollowStore();

  const handleSeeMore = () => {
    setIsMore((prev) => !prev);
  };

  useEffect(() => {
    initialUsers?.forEach((user) => {
      initializeFollowStatus(user.id, user.isFollowed);
    });
  }, [initialUsers, initializeFollowStatus]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{TITLE}</p>

      {isError ? (
        <span className={styles.emptyStateText}>{ERROR_USERS_TEXT}</span>
      ) : (
        <div className={clsx(styles.users, isMore ? styles.active : '')}>
          {initialUsers && initialUsers.length === 0 && (
            <span className={styles.emptyStateText}>{EMPTY_USERS_TEXT}</span>
          )}

          {initialUsers &&
            initialUsers.map((user) => (
              <UserSmallCard
                key={user.id}
                user={user}
                isFollowed={user.isFollowed}
                currentUserId={currentUserId}
              />
            ))}
        </div>
      )}

      {initialUsers && initialUsers.length > 0 && (
        <button
          type='button'
          className={styles.showButton}
          onClick={handleSeeMore}
        >
          {isMore ? SHOW_LESS_BUTTON : SHOW_MORE_BUTTON}
        </button>
      )}
    </div>
  );
};
