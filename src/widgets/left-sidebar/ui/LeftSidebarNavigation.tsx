'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { MoreActions } from '@/widgets/more-actions';

import { LINKS, MORE_ACTION } from '../lib';
import styles from './LeftSidebar.module.scss';

export const LeftSidebarNavigation = () => {
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {LINKS.map(({ href, label, icon, className, action }) => {
          const isActive = pathname === href;

          const handleClick = () => {
            if (action === MORE_ACTION) {
              setIsMoreActionsOpen(true);
              return;
            }
          };

          return (
            <li
              key={label}
              className={clsx(
                styles.listItem,
                isActive && styles.active,
                className,
              )}
            >
              {href ? (
                <Link href={href} className={styles.listLink}>
                  <span className={styles.linkIcon}>{icon}</span>
                  <span className={styles.linkText}>{label}</span>
                </Link>
              ) : (
                <button
                  type='button'
                  className={styles.listLink}
                  onClick={handleClick}
                  aria-label={label}
                >
                  <span className={styles.linkIcon}>{icon}</span>
                  <span className={styles.linkText}>{label}</span>
                </button>
              )}

              {action === MORE_ACTION && isMoreActionsOpen && (
                <MoreActions onClose={() => setIsMoreActionsOpen(false)} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
