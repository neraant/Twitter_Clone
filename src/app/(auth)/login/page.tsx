import lampImage from '@assets/images/lamp.png';
import loginBgImage from '@assets/images/login-page-bg.png';
import personImage from '@assets/images/person.png';
import { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/shared/ui/container';
import { LoginForm } from '@/widgets/login-form';

import styles from './login.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Login',
  description: 'This is the login page',
};

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <div className={styles.imagesWrapper}>
          <Image
            src={personImage}
            alt='person'
            className={styles.personImage}
          />
          <Image
            src={loginBgImage}
            alt='background'
            priority
            className={styles.bgImage}
          />
          <Image src={lampImage} alt='lamp' className={styles.lampImage} />
        </div>

        <LoginForm />
      </Container>
    </div>
  );
}
