import { Metadata } from 'next';
import Image from 'next/image';

import { BASE_URL } from '@/shared/lib/common';
import { Container } from '@/shared/ui/container';
import { RegisterForm } from '@/widgets/register-form/ui';

import styles from './register.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Register',
  description: 'Create your account and join thousands of users 🚀',

  openGraph: {
    title: 'Twitter Clone | Register',
    description: 'Create your account and join thousands of users 🚀',
    url: `${BASE_URL}/register`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Register',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Register to Twitter Clone',
    description: 'Create your account and join thousands of users 🚀',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

const personImage = '/images/person-with-laptop.webp';
const registerBgImage = '/images/sign-up-page-bg.webp';

export default function Register() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <div className={styles.imagesWrapper}>
          <Image
            src={registerBgImage}
            alt='background'
            width={1440}
            height={1000}
            priority
            className={styles.bgImage}
          />
        </div>

        <div className={styles.registerWrapper}>
          <Image
            src={personImage}
            alt='person'
            width={400}
            height={400}
            className={styles.personImage}
          />

          <RegisterForm />
        </div>
      </Container>
    </div>
  );
}
