'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { routes } from '@/shared/config/routes';
import { CurveBackIcon, NotFound404Icon } from '@/shared/ui/icon';

import styles from './not-found.module.scss';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.titles}>
          <h1 className={styles.title}>Oops!</h1>
          <p className={styles.subtitle}>
            Something went wrong. Try to reload the page.
          </p>
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
