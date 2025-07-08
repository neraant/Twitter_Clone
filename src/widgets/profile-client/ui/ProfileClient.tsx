'use client';

import { useEffect } from 'react';

import { Post } from '@/entities/post';
import { User } from '@/entities/user';
import { EditProfileModal } from '@/widgets/edit-profile-modal';
import { ProfileBanner } from '@/widgets/profile-banner';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';

import { useProfileStore } from '../model';
import { ProfileClientSkeleton } from './ProfileClientSkeleton';

type ProfileClientProps = {
  user: User;
  tweets: Post[];
  currentUserId: string;
  isOwner: boolean;
  isInitialFollow?: boolean;
};

export const ProfileClient = ({
  user,
  tweets,
  currentUserId,
  isInitialFollow,
  isOwner,
}: ProfileClientProps) => {
  const storeUser = useProfileStore((state) => state.user);
  const setUser = useProfileStore((state) => state.setUser);
  const setTweets = useProfileStore((state) => state.setTweets);
  const setCurrentUserId = useProfileStore((state) => state.setCurrentUserId);
  const setIsOwner = useProfileStore((state) => state.setIsOwner);
  const setIsInitialFollow = useProfileStore(
    (state) => state.setIsInitialFollow,
  );
  const isEditModalOpen = useProfileStore((state) => state.isEditModalOpen);
  const closeEditModal = useProfileStore((state) => state.closeEditModal);

  useEffect(() => {
    setUser(user);
    setTweets(tweets);
    setCurrentUserId(currentUserId);
    setIsOwner(isOwner);
    setIsInitialFollow(isInitialFollow ?? false);
  }, [
    user,
    tweets,
    currentUserId,
    isOwner,
    isInitialFollow,
    setUser,
    setTweets,
    setCurrentUserId,
    setIsOwner,
    setIsInitialFollow,
  ]);

  if (!storeUser) return <ProfileClientSkeleton />;

  return (
    <>
      <ProfileBanner
        userName={user.name}
        userBanner={user.banner_url}
        tweetsLength={tweets.length}
      />
      <ProfileHeader />
      <ProfileStats />

      {isEditModalOpen && <EditProfileModal onClose={closeEditModal} />}
    </>
  );
};
