'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { UserSmallCard } from '@/entities/user';
import { useUsersStore } from '@/entities/user/model';
import { UserSmallCardSkeleton } from '@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton';
import { useAuthStore } from '@/features/auth/model';

import {
  EMPTY_USERS_TEXT,
  SHOW_LESS_BUTTON,
  SHOW_MORE_BUTTON,
  SKELETON_COUNT,
  TITLE,
} from '../lib';
import styles from './YouMightLike.module.scss';

export const YouMightLike = () => {
  const currentUser = useAuthStore((state) => state.user);

  const users = useUsersStore((state) => state.users);
  const isLoading = useUsersStore((state) => state.isLoading);
  const fetchUsers = useUsersStore((state) => state.fetchUsers);

  const [isMore, setIsMore] = useState(false);

  useEffect(() => {
    if (currentUser?.id) fetchUsers(currentUser.id);
  }, [currentUser?.id, fetchUsers]);

  const handleSeeMore = () => {
    setIsMore((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{TITLE}</p>

      <div className={clsx(styles.users, isMore ? styles.active : '')}>
        {isLoading &&
          users.length === 0 &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <UserSmallCardSkeleton key={i} />
          ))}

        {!isLoading && users.length === 0 && (
          <span className={styles.emptyStateText}>{EMPTY_USERS_TEXT}</span>
        )}

        {users.map((user) => (
          <UserSmallCard key={user.id} user={user} />
        ))}
      </div>

      <button
        type='button'
        className={styles.showButton}
        onClick={handleSeeMore}
      >
        {isMore ? SHOW_LESS_BUTTON : SHOW_MORE_BUTTON}
      </button>
    </div>
  );
};
