import { useState } from 'react';

import { useToast } from '@/shared/lib/toast';

import { followUserAction, unfollowUserAction } from '../api/followActions';
import { useFollowStore } from '../model';

export const useFollow = ({
  targetUserId,
  currentUserId,
  isInitialFollow,
}: {
  targetUserId: string;
  currentUserId: string;
  isInitialFollow: boolean;
}) => {
  const { setFollowStatus, getFollowStatus } = useFollowStore();
  const isFollowed = getFollowStatus(targetUserId, isInitialFollow);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleClick = async () => {
    if (loading) return;

    const newFollowState = !isFollowed;
    setFollowStatus(targetUserId, newFollowState);

    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUserAction(targetUserId, currentUserId);
      } else {
        await followUserAction(targetUserId, currentUserId);
      }
    } catch (error) {
      console.error(error);
      setFollowStatus(targetUserId, !newFollowState);

      showToast('Error', 'Something went wrong! Follow failure!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleClick, loading, isFollowed };
};
