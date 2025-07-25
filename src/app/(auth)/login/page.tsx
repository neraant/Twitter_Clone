import { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/shared/ui/container';
import { LoginForm } from '@/widgets/login-form';

import styles from './login.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Login',
  description: 'This is the login page',
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
