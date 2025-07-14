import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getUserPostsCount } from '@/entities/post/api';
import { getCurrentUserAction, getUserByIdAction } from '@/entities/user/api';
import { isFollowingAction } from '@/features/follow-button/api/followActions';
import { isValidUUID } from '@/shared/lib/isValidUUID';
import { ProfileClient, ProfileClientSkeleton } from '@/widgets/profile-client';

export const metadata: Metadata = {
  title: 'Twitter Clone | Profile',
  description: 'This is the profile page',
};

async function ProfileData({ userId }: { userId: string }) {
  try {
    const [user, currentUser, tweetsCount] = await Promise.all([
      getUserByIdAction(userId),
      getCurrentUserAction(),
      getUserPostsCount(userId),
    ]);

    if (!user || !currentUser) return notFound();

    const isInitialFollow = await isFollowingAction(user.id, currentUser.id);
    const isOwner = currentUser.id === userId;

    return (
      <ProfileClient
        user={user}
        tweetsCount={tweetsCount}
        currentUserId={currentUser.id}
        isOwner={isOwner}
        isInitialFollow={isInitialFollow}
      />
    );
  } catch (error) {
    console.error('ProfileData error:', error);
    return notFound();
  }
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidUUID(id)) return notFound();

  return (
    <div>
      <Suspense fallback={<ProfileClientSkeleton />}>
        <ProfileData userId={id} />
      </Suspense>
    </div>
  );
}
