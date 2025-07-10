import { useCallback, useEffect } from 'react';

import { useToast } from '@/shared/lib/toast';

import { followUserAction, unfollowUserAction } from '../api/followActions';
import { useFollowStore } from '../model';
import { FOLLOWED, UNFOLLOWED } from './followButton.constants';

type UseFollowProps = {
  targetUserId: string;
  currentUserId: string;
  isInitialFollow: boolean;
};

export const useFollow = ({
  targetUserId,
  currentUserId,
  isInitialFollow,
}: UseFollowProps) => {
  const {
    initializeFollowStatus,
    setFollowStatus,
    getFollowStatus,
    setUserLoading,
    isUserLoading,
  } = useFollowStore();
  const { showToast } = useToast();

  useEffect(() => {
    initializeFollowStatus(targetUserId, isInitialFollow);
  }, [targetUserId, isInitialFollow, initializeFollowStatus]);

  const isFollowed = getFollowStatus(targetUserId, isInitialFollow);
  const loading = isUserLoading(targetUserId);

  const handleClick = useCallback(async () => {
    if (loading) return;

    try {
      setUserLoading(targetUserId, true);

      let result;
      if (isFollowed) {
        result = await unfollowUserAction(targetUserId, currentUserId);
      } else {
        result = await followUserAction(targetUserId, currentUserId);
      }

      if (result.success) {
        setFollowStatus(targetUserId, !isFollowed);
        const MESSAGE = `You ${!isFollowed ? FOLLOWED : UNFOLLOWED} successfully`;
        showToast('Success', MESSAGE, 'success');
      } else {
        showToast('Error', 'Something went wrong', 'error');
      }
    } catch (error) {
      showToast('Error', 'Something went wrong', 'error');
      console.error('Follow/Unfollow error:', error);
    } finally {
      setUserLoading(targetUserId, false);
    }
  }, [
    targetUserId,
    currentUserId,
    showToast,
    isFollowed,
    loading,
    setFollowStatus,
    setUserLoading,
  ]);

  return {
    handleClick,
    loading,
    isFollowed,
  };
};
