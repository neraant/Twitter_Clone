'use client';

import Link from 'next/link';

import { SignTypeButton, useAuthStore } from '@/features/auth';
import { routes } from '@/shared/config/routes';
import { GoogleLogoIcon, TwitterLogoIcon } from '@/shared/ui/icon';

import {
  SIGN_WITH_EMAIL_LABEL,
  SIGN_WITH_GOOGLE,
  SUBTITLE,
  TEXTS,
  TITLE,
} from '../lib';
import styles from './WelcomeForm.module.scss';

export const WelcomeForm = () => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  return (
    <div className={styles.form}>
      <TwitterLogoIcon className={styles.logo} width={48} height={48} />

      <h1 className={styles.title}>{TITLE}</h1>

      <h2 className={styles.subtitle}>{SUBTITLE}</h2>

      <div className={styles.buttonsWrapper}>
        <SignTypeButton label={SIGN_WITH_GOOGLE} onClick={loginWithGoogle}>
          <GoogleLogoIcon width={28} height={28} />
        </SignTypeButton>

        <SignTypeButton
          label={SIGN_WITH_EMAIL_LABEL}
          href={routes.auth.signUp}
        />
      </div>

      <p className={styles.infoText}>
        {TEXTS.signupInfoPart1}{' '}
        <Link href='#' className={styles.link}>
          {TEXTS.termsOfService}
        </Link>{' '}
        {TEXTS.and}{' '}
        <Link href='#' className={styles.link}>
          {TEXTS.privacyPolicy}
        </Link>
        , {TEXTS.including}{' '}
        <Link href='#' className={styles.link}>
          {TEXTS.cookieUse}
        </Link>
        {TEXTS.dot}
      </p>

      <span className={styles.haveAccountText}>
        {TEXTS.haveAccount}{' '}
        <Link href={routes.auth.login} className={styles.link}>
          {TEXTS.logIn}
        </Link>
      </span>
    </div>
  );
};
