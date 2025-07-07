'use client';

import { useAuthStore } from '@features/auth/model';
import { useEffect, useState } from 'react';

import { useProfileStore } from '@/entities/user';
import { useToast } from '@/shared/lib/toast';
import { Loader } from '@/shared/ui/loader';

import { followUser, isFollowing, unfollowUser } from '../api';
import { FOLLOW_TEXT, UNFOLLOW_TEXT } from '../lib';
import styles from './FollowButton.module.scss';

export const FollowButton = ({ targetUserId }: { targetUserId?: string }) => {
  const currentUser = useAuthStore((state) => state.user);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const profileUser = useProfileStore((state) => state.profileUser);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const incrementFollowers = useProfileStore(
    (state) => state.incrementFollowers,
  );
  const decrementFollowers = useProfileStore(
    (state) => state.decrementFollowers,
  );

  useEffect(() => {
    if (!currentUser || !targetUserId) return;
    isFollowing(targetUserId, currentUser.id).then(setIsFollowed);
  }, [targetUserId, currentUser]);

  const handleClick = async () => {
    if (!currentUser || loading || !targetUserId) return;

    const newFollowState = !isFollowed;
    setIsFollowed(newFollowState);
    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(targetUserId, currentUser.id);
        if (profileUser && profileUser.id === targetUserId) {
          decrementFollowers();
        }
        if (updateCurrentUser) {
          updateCurrentUser({
            ...currentUser,
            following_count: currentUser.following_count - 1,
          });
        }
      } else {
        await followUser(targetUserId, currentUser.id);
        if (profileUser && profileUser.id === targetUserId) {
          incrementFollowers();
        }
        if (updateCurrentUser) {
          updateCurrentUser({
            ...currentUser,
            following_count: currentUser.following_count + 1,
          });
        }
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
