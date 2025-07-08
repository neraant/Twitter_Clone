import { useState } from 'react';

import { useToast } from '@/shared/lib/toast';
import { useProfileStore } from '@/widgets/profile-client/model';

import { followUser, unfollowUser } from '../api/clientFollowApi';
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
  const updateFollowersCount = useProfileStore(
    (state) => state.updateFollowersCount,
  );
  const updateFollowingCount = useProfileStore(
    (state) => state.updateFollowingCount,
  );
  const setIsInitialFollow = useProfileStore(
    (state) => state.setIsInitialFollow,
  );
  const profileUserId = useProfileStore((state) => state.user?.id);
  const isOwner = useProfileStore((state) => state.isOwner);

  const handleClick = async () => {
    if (loading) return;

    const newFollowState = !isFollowed;
    setFollowStatus(targetUserId, newFollowState);

    if (targetUserId === profileUserId) {
      updateFollowersCount(newFollowState ? +1 : -1);
      setIsInitialFollow(newFollowState);
    }

    if (isOwner) {
      updateFollowingCount(newFollowState ? +1 : -1);
    }

    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(targetUserId, currentUserId);
      } else {
        await followUser(targetUserId, currentUserId);
      }
    } catch (error) {
      console.error(error);
      setFollowStatus(targetUserId, !newFollowState);

      if (targetUserId === profileUserId) {
        updateFollowersCount(newFollowState ? -1 : +1);
        setIsInitialFollow(!newFollowState);
      }

      if (isOwner) {
        updateFollowingCount(newFollowState ? -1 : +1);
      }

      showToast('Error', 'Something went wrong! Follow failure!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleClick, loading, isFollowed };
};
