import React from 'react';

import { AddPostFormSkeleton } from '@/widgets/add-post-form';
import { PostsListSkeleton } from '@/widgets/posts-list';
import { ProfileBannerHeaderSkeleton } from '@/widgets/profile-banner/ui/ProfileBannerHeaderSkeleton';
import { ProfileHeaderSkeleton } from '@/widgets/profile-header';
import { ProfileStatsSkeleton } from '@/widgets/profile-stats';

type ProfileClientSkeleton = {
  isOwner?: boolean;
};

export const ProfileClientSkeleton = ({
  isOwner = false,
}: ProfileClientSkeleton) => {
  return (
    <>
      <ProfileBannerHeaderSkeleton />
      <ProfileHeaderSkeleton />
      <ProfileStatsSkeleton />
      {isOwner && <AddPostFormSkeleton />}
      <PostsListSkeleton />
    </>
  );
};
