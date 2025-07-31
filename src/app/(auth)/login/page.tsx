import { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/shared/ui/container';
import { LoginForm } from '@/widgets/login-form';

import styles from './login.module.scss';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Login',
  description: 'Login to your account and join the conversation ✨',

  openGraph: {
    title: 'Twitter Clone | Login',
    description: 'Login to your account and join the conversation ✨',
    url: `${BASE_URL}/login`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Login',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Login to Twitter Clone',
    description: 'Login to your account and join the conversation ✨',
    images: [`${BASE_URL}/images/og-image.png`],
  },
};

const lampImage = '/images/lamp.webp';
const loginBgImage = '/images/login-page-bg.webp';
const personImage = '/images/person.webp';

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <div className={styles.imagesWrapper}>
          <Image
            src={personImage}
            alt='person'
            width={400}
            height={400}
            className={styles.personImage}
          />
          <Image
            src={loginBgImage}
            alt='background'
            width={1440}
            height={1000}
            priority
            className={styles.bgImage}
          />
          <Image
            src={lampImage}
            width={200}
            height={300}
            alt='lamp'
            className={styles.lampImage}
          />
        </div>

        <LoginForm />
      </Container>
    </div>
  );
}
