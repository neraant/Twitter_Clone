import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getUserTweets } from '@/entities/post/api';
import { getCurrentUserAction } from '@/entities/user/api';
import { ProfileClient, ProfileClientSkeleton } from '@/widgets/profile-client';

import styles from './profile.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Profile',
  description: 'This is the profile page',
};

async function ProfileData() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return null;

    const tweets = await getUserTweets({ userId: user.id });

    return (
      <ProfileClient
        user={user}
        tweets={tweets}
        currentUserId={user.id}
        isOwner={true}
      />
    );
  } catch (error) {
    console.error('ProfileData error:', error);
    return notFound();
  }
}

export default function Profile() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<ProfileClientSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
