import { useAuthStore } from '@x/follow';
import { useEffect, useState } from 'react';

import { useToast } from '@/shared/lib/toast';

import { followUser, isFollowing, unfollowUser } from '../api';
import { FOLLOW_TEXT, UNFOLLOW_TEXT } from '../lib';
import styles from './FollowButton.module.scss';

export const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
  const currentUser = useAuthStore((state) => state.user);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!currentUser) return;

    isFollowing(targetUserId, currentUser.id).then(setIsFollowed);
  }, [targetUserId, currentUser]);

  const handleClick = async () => {
    if (!currentUser || loading) return;

    const newFollowState = !isFollowed;
    setIsFollowed(newFollowState);
    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(targetUserId, currentUser.id);
      } else {
        await followUser(targetUserId, currentUser.id);
      }
    } catch (error) {
      setIsFollowed(!newFollowState);
      if (typeof error === 'string') {
        showToast('Error', error, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.id === targetUserId) return null;

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
