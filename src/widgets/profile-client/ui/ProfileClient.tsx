'use client';

import { useState } from 'react';

import { PostFetchingMode } from '@/entities/post';
import { User } from '@/entities/user';
import { AddPostForm } from '@/widgets/add-post-form/ui/AddPostForm';
import { EditProfileModal } from '@/widgets/edit-profile-modal';
import { PostsList } from '@/widgets/posts-list';
import { ProfileBanner } from '@/widgets/profile-banner';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';

type ProfileClientProps = {
  user: User;
  tweetsCount: number;
  currentUserId: string;
  isOwner: boolean;
  isInitialFollow?: boolean;
};

export const ProfileClient = ({
  user,
  tweetsCount,
  currentUserId,
  isInitialFollow = false,
  isOwner,
}: ProfileClientProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <section>
        <ProfileBanner
          userName={user.name}
          userBanner={user.banner_url}
          tweetsLength={tweetsCount}
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
          onEditClick={() => setIsEditModalOpen(true)}
        />
      </section>

      <section>
        {isOwner && <AddPostForm user={user} />}
        <PostsList
          userId={user.id}
          currentUserId={currentUserId}
          mode={PostFetchingMode.user}
        />
      </section>

      {user && isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};
