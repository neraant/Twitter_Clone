import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getUserPostsCount } from '@/entities/post/api';
import { getCurrentUserAction } from '@/entities/user/api';
import { ProfileClient, ProfileClientSkeleton } from '@/widgets/profile-client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUserAction();

  const username = user?.name || 'Your Profile';
  const bio = user?.bio || 'See what you’ve been sharing 📝✨';
  const userId = user?.id || '';
  const image = user?.avatar_url || `${BASE_URL}/images/user-avatar.png`;

  return {
    title: `Twitter Clone | ${username}`,
    description: bio,
    openGraph: {
      title: `Twitter Clone | ${username}`,
      description: bio,
      url: `${BASE_URL}/profile/${userId}`,
      siteName: 'Twitter Clone',
      locale: 'en_US',
      type: 'profile',
      images: [
        {
          url: image,
          width: 400,
          height: 400,
          alt: `${username}'s avatar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Twitter Clone | ${username}`,
      description: bio,
      images: [image],
    },
  };
}

async function ProfileData() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return null;

    const tweetsCount = await getUserPostsCount(user.id);

    return (
      <ProfileClient
        user={user}
        tweetsCount={tweetsCount}
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
    <div>
      <Suspense fallback={<ProfileClientSkeleton isOwner />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
