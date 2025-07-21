import Image from 'next/image';

import { BackButton } from '@/shared/ui/back-button';

import { TWEET, TWEETS, UNNAMED_USER } from '../lib';
import styles from './ProfileBanner.module.scss';

interface ProfileBannerClientProps {
  userName: string | null;
  userBanner: string | null;
  tweetsLength: string | number;
}

const DefaultBanner = '/images/default-banner.webp';

export const ProfileBanner = ({
  userName,
  userBanner,
  tweetsLength,
}: ProfileBannerClientProps) => {
  const TWEET_TEXT = `${tweetsLength} ${tweetsLength === 1 ? TWEET : TWEETS}`;

  return (
    <div className={styles.profileBannerWrapper}>
      <div className={styles.profileHeaderWrapper}>
        <BackButton />

        <div className={styles.wrapper}>
          <p className={styles.name}>{userName || UNNAMED_USER}</p>
          <p className={styles.tweetsQnty}>{TWEET_TEXT}</p>
        </div>
      </div>

      <Image
        src={userBanner || DefaultBanner}
        className={styles.bannerImage}
        alt='banner'
        width={650}
        height={300}
        fetchPriority='high'
        priority
      />
    </div>
  );
};
