'use client';

import { useState } from 'react';

import { User } from '@/entities/user';
import { useLockBodyScroll } from '@/shared/lib/hooks';
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
};

export const ProfileClient = ({
  user,
  tweetsCount,
  currentUserId,
  isOwner,
}: ProfileClientProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useLockBodyScroll(isEditModalOpen);

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
          onEditClick={() => setIsEditModalOpen(true)}
        />
      </section>

      <section>
        {isOwner && <AddPostForm user={user} />}
        <PostsList userId={user.id} currentUserId={currentUserId} />
      </section>

      {user && isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};
