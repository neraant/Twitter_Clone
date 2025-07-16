import { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@/shared/config/routes';
import { CurveBackIcon, NotFound404Icon } from '@/shared/ui/icon';

import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: 'Page Not Found | Twitter Clone',
  description: 'Oops! This page does not exist 😢',
};

export default async function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.titles}>
          <h1 className={styles.title}>Oops!</h1>
          <p className={styles.subtitle}>You are lost</p>
        </div>

        <NotFound404Icon className={styles.icon} />

        <Link className={styles.link} href={routes.root}>
          <CurveBackIcon width={35} height={35} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
