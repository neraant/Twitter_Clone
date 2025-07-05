'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { HEADER_LINKS } from '@/shared/lib/header';

import { TwitterLogoIcon } from '../icon';
import styles from './Header.module.scss';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link className={styles.headerIconLink} href={routes.app.home}>
        <TwitterLogoIcon width={40} height={33} className={styles.headerIcon} />
      </Link>

      <nav className={styles.headerNav}>
        <ul className={styles.headerList}>
          {HEADER_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href;

            return (
              <li
                title={label}
                key={`${label}_header`}
                className={clsx(
                  styles.headerListItem,
                  isActive ? styles.active : '',
                )}
              >
                <Link href={href} className={styles.listLink}>
                  <span className={styles.linkIcon}>{icon}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
