'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/lib/toast';

import {
  followUserAction,
  isFollowingAction,
  unfollowUserAction,
} from '../api/followActions';
import { useFollowStore } from '../model';

type UseFollowProps = {
  targetUserId: string;
  currentUserId: string;
};

export const useFollow = ({ targetUserId, currentUserId }: UseFollowProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { setUserLoading, isUserLoading } = useFollowStore();

  const { data: isFollowed, isLoading: isQueryLoading } = useQuery({
    queryKey: ['isFollowing', targetUserId, currentUserId],
    queryFn: () => isFollowingAction(targetUserId, currentUserId),
    enabled: !!targetUserId && !!currentUserId,
    staleTime: 5 * 60 * 1000,
  });

  const followMutation = useMutation({
    mutationFn: () => followUserAction(targetUserId, currentUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['isFollowing', targetUserId, currentUserId],
      });

      queryClient.setQueryData(
        ['isFollowing', targetUserId, currentUserId],
        true,
      );
    },
    onSuccess: () => {
      showToast('Success', 'Followed', 'success');

      queryClient.invalidateQueries({
        queryKey: ['isFollowing', targetUserId, currentUserId],
      });
    },
    onError: () => {
      showToast('Error', 'Failed to follow', 'error');

      queryClient.setQueryData(
        ['isFollowing', targetUserId, currentUserId],
        false,
      );
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUserAction(targetUserId, currentUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['isFollowing', targetUserId, currentUserId],
      });

      queryClient.setQueryData(
        ['isFollowing', targetUserId, currentUserId],
        false,
      );
    },
    onSuccess: () => {
      showToast('Success', 'Unfollowed', 'success');
      queryClient.invalidateQueries({
        queryKey: ['isFollowing', targetUserId, currentUserId],
      });
    },
    onError: () => {
      showToast('Error', 'Failed to unfollow', 'error');
      queryClient.setQueryData(
        ['isFollowing', targetUserId, currentUserId],
        true,
      );
    },
  });

  const handleClick = () => {
    setUserLoading(targetUserId, true);
    const mutation = isFollowed ? unfollowMutation : followMutation;

    mutation.mutate(undefined, {
      onSettled: () => setUserLoading(targetUserId, false),
    });
  };

  const loading =
    isQueryLoading ||
    followMutation.isPending ||
    unfollowMutation.isPending ||
    isUserLoading(targetUserId);

  return {
    isFollowed: !!isFollowed,
    loading,
    handleClick,
  };
};
