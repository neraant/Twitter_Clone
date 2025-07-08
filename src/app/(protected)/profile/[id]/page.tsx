import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getUserTweets } from '@/entities/post/api';
import { getCurrentUser, getUserById } from '@/entities/user/api';
import { isFollowing } from '@/features/follow-button/api/serverFollowApi';
import { isValidUUID } from '@/shared/lib/isValidUUID';
import { ProfileClient, ProfileClientSkeleton } from '@/widgets/profile-client';

import styles from '../profile.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Profile',
  description: 'This is the profile page',
};

async function ProfileData({ userId }: { userId: string }) {
  const [user, currentUser, tweets] = await Promise.all([
    getUserById(userId),
    getCurrentUser(),
    getUserTweets({ userId }),
  ]);

  if (!user || !currentUser) return null;
  const isInitialFollow = await isFollowing(user.id, currentUser?.id);

  if (!user || !currentUser) return notFound();

  const isOwner = currentUser.id === userId;

  return (
    <ProfileClient
      user={user}
      tweets={tweets}
      currentUserId={currentUser.id}
      isOwner={isOwner}
      isInitialFollow={isInitialFollow}
    />
  );
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidUUID(id)) return notFound();

  return (
    <div className={styles.page}>
      <Suspense fallback={<ProfileClientSkeleton />}>
        <ProfileData userId={id} />
      </Suspense>
    </div>
  );
}
