import personImage from '@assets/images/person-with-laptop.png';
import registerBgImage from '@assets/images/sign-up-page-bg.png';
import { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/shared/ui/container';
import { RegisterForm } from '@/widgets/register-form/ui';

import styles from './register.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Register',
  description: 'This is the register page',
};

export default function Register() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <div className={styles.imagesWrapper}>
          <Image
            src={registerBgImage}
            alt='background'
            priority
            className={styles.bgImage}
          />
        </div>

        <div className={styles.registerWrapper}>
          <Image
            src={personImage}
            alt='person'
            className={styles.personImage}
          />

          <RegisterForm />
        </div>
      </Container>
    </div>
  );
}
