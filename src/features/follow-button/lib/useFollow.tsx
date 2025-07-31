'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FIVE_MINUTES_IN_MS } from '@/entities/post/lib';
import { useToast } from '@/shared/lib/toast';

import {
  followUserAction,
  isFollowingAction,
  unfollowUserAction,
} from '../api/followActions';
import { CallbacksParams, MutationResult, useFollowStore } from '../model';
import { createMutationCallbacks } from './follow.utils';
import { FOLLOW_QUERY_KEYS } from './followButton.constants';

type UseFollowProps = {
  targetUserId: string;
  currentUserId: string;
  initialFollowState?: boolean;
  skipFollowCheck?: boolean;
};

export const useFollow = ({
  targetUserId,
  currentUserId,
  initialFollowState,
  skipFollowCheck = false,
}: UseFollowProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { setUserLoading, isUserLoading } = useFollowStore();

  const queryKey = [FOLLOW_QUERY_KEYS.isFollowing, targetUserId, currentUserId];

  const { data: isFollowed, isLoading: isQueryLoading } = useQuery({
    queryKey,
    queryFn: () => isFollowingAction(targetUserId, currentUserId),
    enabled: !!targetUserId && !!currentUserId,
    staleTime: FIVE_MINUTES_IN_MS,
    initialData: skipFollowCheck ? initialFollowState : undefined,
  });

  const followMutation = useMutation<MutationResult, Error, void>({
    mutationFn: () => followUserAction(targetUserId, currentUserId),
    ...createMutationCallbacks({
      queryClient,
      queryKey,
      showToast,
      successMessage: 'Followed',
      errorMessage: 'Failed to follow',
      optimisticValue: true,
      revertValue: false,
    } as CallbacksParams),
  });

  const unfollowMutation = useMutation<MutationResult, Error, void>({
    mutationFn: () => unfollowUserAction(targetUserId, currentUserId),
    ...createMutationCallbacks({
      queryClient,
      queryKey,
      showToast,
      successMessage: 'Unfollowed',
      errorMessage: 'Failed to unfollow',
      optimisticValue: false,
      revertValue: true,
    } as CallbacksParams),
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
