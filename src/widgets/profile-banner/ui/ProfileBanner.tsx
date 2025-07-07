'use client';

import DefautlBanner from '@assets/images/default-banner.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { usePostsStore } from '@/entities/post';
import { User } from '@/entities/user';
import { BackIcon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';

import { TWEET, TWEETS, UNNAMED_USER } from '../lib';
import styles from './ProfileBanner.module.scss';
import { ProfileBannerHeaderSkeleton } from './ProfileBannerHeaderSkeleton';

interface ProfileBannerProps {
  user?: User | null;
  isLoading?: boolean;
}

export const ProfileBanner = ({
  user,
  isLoading = false,
}: ProfileBannerProps) => {
  const { back } = useRouter();

  const fetchPosts = usePostsStore((state) => state.fetchUserPosts);
  const postsLength = usePostsStore((state) => state.posts.length);
  const isLoadingPosts = usePostsStore((state) => state.isLoading);

  const isFullLoading = isLoading || isLoadingPosts || !user;

  useEffect(() => {
    if (!user?.id) return;
    fetchPosts({ userId: user.id });
  }, [fetchPosts, user?.id]);

  const TWEET_TEXT = `${postsLength} ${postsLength === 1 ? TWEET : TWEETS}`;

  return (
    <div className={styles.profileBannerWrapper}>
      <div className={styles.profileHeaderWrapper}>
        <button
          onClick={back}
          className={styles.backIcon}
          type='button'
          aria-label='back'
        >
          <BackIcon width={24} height={24} />
        </button>

        {isFullLoading ? (
          <ProfileBannerHeaderSkeleton />
        ) : (
          <div className={styles.wrapper}>
            <span className={styles.name}>{user.name || UNNAMED_USER}</span>
            <span className={styles.tweetsQnty}>{TWEET_TEXT}</span>
          </div>
        )}
      </div>

      {isFullLoading ? (
        <Skeleton className={styles.bannerImage} />
      ) : (
        <Image
          src={user?.banner_url || DefautlBanner}
          className={styles.bannerImage}
          alt='banner'
          width={650}
          height={300}
          priority
        />
      )}
    </div>
  );
};
