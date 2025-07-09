'use client';

import { useState } from 'react';

import { Post } from '@/entities/post';
import { User } from '@/entities/user';
import { AddPostForm } from '@/widgets/add-post-form/ui/AddPostForm';
import { EditProfileModal } from '@/widgets/edit-profile-modal';
import { ProfileBanner } from '@/widgets/profile-banner';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';

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
  isInitialFollow = false,
  isOwner,
}: ProfileClientProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <ProfileBanner
        userName={user.name}
        userBanner={user.banner_url}
        tweetsLength={tweets.length}
      />
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        currentUserId={currentUserId}
        onEditClick={() => setIsEditModalOpen(true)}
      />
      <ProfileStats
        user={user}
        isOwner={isOwner}
        currentUserId={currentUserId}
        targetUserId={user.id}
        isInitialFollow={isInitialFollow}
      />

      {isOwner && <AddPostForm />}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};
