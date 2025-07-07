import { useAuthStore } from '@features/auth/model';
import { useMemo } from 'react';

import { useProfileStore } from '@/entities/user';

export const useProfileUser = (userId?: string) => {
  const currentUser = useAuthStore((state) => state.user);
  const profileUser = useProfileStore((state) => state.profileUser);
  const isLoadingProfile =
    useProfileStore((state) => state.isLoading) || !currentUser;

  const user = useMemo(() => {
    if (userId) {
      return profileUser;
    }
    return currentUser;
  }, [userId, profileUser, currentUser]);

  const isOwner = useMemo(
    () => user?.id === currentUser?.id,
    [user, currentUser],
  );

  return {
    user,
    isLoading: isLoadingProfile,
    isOwner,
    currentUser,
  };
};
