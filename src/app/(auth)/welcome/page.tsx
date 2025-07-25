import { Metadata } from 'next';
import Image from 'next/image';

import { WelcomeForm } from '@/widgets/welcome-form/ui/WelcomeForm';

import styles from './welcome.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Welcome',
  description: 'This is the welcome page',
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
