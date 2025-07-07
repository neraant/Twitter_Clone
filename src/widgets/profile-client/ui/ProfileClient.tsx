'use client';

import { useAuthStore } from '@features/auth/model';
import { useEffect, useState } from 'react';

import { useProfileStore, useProfileUser } from '@/entities/user';
import { EditProfileModal } from '@/widgets/edit-profile-modal';
import { ProfileBanner } from '@/widgets/profile-banner';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';

export const ProfileClient = ({ userId }: { userId?: string }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const fetchUserById = useProfileStore((state) => state.fetchProfileUser);
  const resetProfile = useProfileStore((state) => state.resetProfile);

  useEffect(() => {
    if (userId && userId !== currentUser?.id) {
      fetchUserById(userId);
    } else {
      resetProfile();
    }
  }, [userId, currentUser?.id, fetchUserById, resetProfile]);

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsEditModalOpen(true);
  };

  const {
    user,
    isLoading: isUserLoading,
    isOwner,
  } = useProfileUser(userId ?? undefined);

  if (!user) return null;

  return (
    <>
      <ProfileBanner user={user} isLoading={isUserLoading} />
      <ProfileHeader
        user={user}
        isLoading={isUserLoading}
        isOwner={isOwner}
        onEditProfileClick={handleOpenModal}
      />
      <ProfileStats
        user={user}
        isLoading={isUserLoading}
        isOwner={isOwner}
        onEditProfileClick={handleOpenModal}
      />

      {isEditModalOpen && <EditProfileModal onClose={handleCloseModal} />}
    </>
  );
};
