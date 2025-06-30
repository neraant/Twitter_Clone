import desktopBanner from '@assets/images/welcome-page-banner-desktop.png';
import mobileBanner from '@assets/images/welcome-page-banner-mobile.png';
import { Metadata } from 'next';
import Image from 'next/image';

import { WelcomeForm } from '@/widgets/welcome-form/ui/WelcomeForm';

import styles from './welcome.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Welcome',
  description: 'This is the welcome page',
};

export default function Welcome() {
  return (
    <div className={styles.wrapper}>
      <picture className={styles.picture}>
        <source srcSet={mobileBanner.src} media='(max-width: 620px)' />
        <Image
          src={desktopBanner}
          alt='banner'
          className={styles.banner}
          priority
        />
      </picture>
      <WelcomeForm />
    </div>
  );
}
