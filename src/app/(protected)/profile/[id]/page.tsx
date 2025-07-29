import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getUserPostsCount } from '@/entities/post/api';
import { getCurrentUserAction, getUserByIdAction } from '@/entities/user/api';
import { BASE_URL } from '@/shared/lib/common';
import { isValidUUID } from '@/shared/lib/isValidUUID';
import { ProfileClient, ProfileClientSkeleton } from '@/widgets/profile-client';

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserByIdAction(userId);

  const username = user?.name || 'User';
  const bio = user?.bio || 'Check out this user profile on Twitter Clone!';
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

async function ProfileData({ userId }: { userId: string }) {
  try {
    const [user, currentUser, tweetsCount] = await Promise.all([
      getUserByIdAction(userId),
      getCurrentUserAction(),
      getUserPostsCount(userId),
    ]);

    if (!user || !currentUser) return notFound();

    const isOwner = currentUser.id === userId;

    return (
      <ProfileClient
        user={user}
        tweetsCount={tweetsCount}
        currentUserId={currentUser.id}
        isOwner={isOwner}
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
