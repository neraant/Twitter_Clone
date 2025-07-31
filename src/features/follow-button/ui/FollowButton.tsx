'use client';

import { Loader } from '@/shared/ui/loader';

import { FOLLOW_TEXT, UNFOLLOW_TEXT, useFollow } from '../lib';
import styles from './FollowButton.module.scss';

type FollowButtonProps = {
  targetUserId: string;
  currentUserId: string;
  initialFollowState?: boolean;
  skipFollowCheck?: boolean;
};

export const FollowButton = ({
  targetUserId,
  currentUserId,
  initialFollowState,
  skipFollowCheck = false,
}: FollowButtonProps) => {
  const { handleClick, loading, isFollowed } = useFollow({
    targetUserId,
    currentUserId,
    initialFollowState,
    skipFollowCheck,
  });

  if (!skipFollowCheck && isFollowed === undefined) {
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
