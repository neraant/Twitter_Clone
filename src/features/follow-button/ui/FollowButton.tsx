'use client';

import { Loader } from '@/shared/ui/loader';

import { FOLLOW_TEXT, UNFOLLOW_TEXT, useFollow } from '../lib';
import styles from './FollowButton.module.scss';

type FollowButtonProps = {
  targetUserId: string;
  currentUserId: string;
};

export const FollowButton = ({
  targetUserId,
  currentUserId,
}: FollowButtonProps) => {
  const { handleClick, loading, isFollowed } = useFollow({
    targetUserId,
    currentUserId,
  });

  if (isFollowed === undefined) {
    return null;
  }

  return (
    <button
      className={styles.followButton}
      onClick={handleClick}
      aria-label='follow'
      type='button'
      disabled={loading}
    >
      {loading ? (
        <Loader className={styles.loader} />
      ) : isFollowed ? (
        UNFOLLOW_TEXT
      ) : (
        FOLLOW_TEXT
      )}
    </button>
  );
};
