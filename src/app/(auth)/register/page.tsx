import { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/shared/ui/container';
import { RegisterForm } from '@/widgets/register-form/ui';

import styles from './register.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Register',
  description: 'This is the register page',
};

const personImage = '/images/person-with-laptop.png';
const registerBgImage = '/images/sign-up-page-bg.png';

export default function Register() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <div className={styles.imagesWrapper}>
          <Image
            src={registerBgImage}
            alt='background'
            priority
            width={1440}
            height={1000}
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
