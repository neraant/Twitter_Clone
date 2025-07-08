import React from 'react';

import { ProfileBannerHeaderSkeleton } from '@/widgets/profile-banner/ui/ProfileBannerHeaderSkeleton';
import { ProfileHeaderSkeleton } from '@/widgets/profile-header';
import { ProfileStatsSkeleton } from '@/widgets/profile-stats';

export const ProfileClientSkeleton = () => {
  return (
    <>
      <ProfileBannerHeaderSkeleton />
      <ProfileHeaderSkeleton />
      <ProfileStatsSkeleton />
    </>
  );
};
