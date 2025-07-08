'use client';

import { useState } from 'react';

import { useToast } from '@/shared/lib/toast';

import { followUser, unfollowUser } from '../api/clientFollowApi';
import { FOLLOW_TEXT, UNFOLLOW_TEXT } from '../lib';
import styles from './FollowButton.module.scss';

type FollowButtonProps = {
  isInitialFollow: boolean;
  targetUserId: string;
  currentUserId: string;
};

export const FollowButton = ({
  isInitialFollow,
  targetUserId,
  currentUserId,
}: FollowButtonProps) => {
  const [isFollowed, setIsFollowed] = useState(isInitialFollow);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleClick = async () => {
    if (loading) return;

    const newFollowState = !isFollowed;
    setIsFollowed(newFollowState);
    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(targetUserId, currentUserId);
      } else {
        await followUser(targetUserId, currentUserId);
      }
    } catch (error) {
      setIsFollowed(!newFollowState);
      showToast(
        'Error',
        error instanceof Error ? error.message : 'Ошибка',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles.followButton}
      onClick={handleClick}
      aria-label='follow'
      type='button'
    >
      {isFollowed ? UNFOLLOW_TEXT : FOLLOW_TEXT}
    </button>
  );
};
