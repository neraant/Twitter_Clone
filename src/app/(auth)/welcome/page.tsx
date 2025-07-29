import { Metadata } from 'next';
import Image from 'next/image';

import { BASE_URL } from '@/shared/lib/common';
import { WelcomeForm } from '@/widgets/welcome-form/ui/WelcomeForm';

import styles from './welcome.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Welcome',
  description:
    'Welcome to our amazing Twitter Clone! Join thousands of users sharing their thoughts.',

  openGraph: {
    title: 'Twitter Clone | Welcome',
    description:
      'Welcome to our amazing Twitter Clone! Join thousands of users sharing their thoughts.',
    url: `${BASE_URL}/welcome`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Welcome',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Twitter Clone',
    description:
      'Welcome to our amazing Twitter Clone! Join thousands of users sharing their thoughts.',
    images: [`${BASE_URL}/images/og-image.png`],
  },
};

const desktopBanner = '/images/welcome-page-banner-desktop.webp';
const mobileBanner = '/images/welcome-page-banner-mobile.webp';

const breakpointSm = 620;

export default function Welcome() {
  return (
    <div className={styles.wrapper}>
      <picture className={styles.picture}>
        <source
          srcSet={mobileBanner}
          media={`(max-width: ${breakpointSm}px)`}
        />
        <Image
          src={desktopBanner}
          alt='banner'
          className={styles.banner}
          width={650}
          height={650}
          priority
        />
      </picture>
      <WelcomeForm />
    </div>
  );
}
