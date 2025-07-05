'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { UserSmallCard } from '@/entities/user';
import { UserSmallCardSkeleton } from '@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton';
import { LogoutButton, useAuthStore } from '@/features/auth';
import { routes } from '@/shared/config/routes';
import { Button } from '@/shared/ui/button/Button';
import { LogoutIcon, PlusIcon, TwitterLogoIcon } from '@/shared/ui/icon';
import { MoreActions } from '@/widgets/more-actions';

import { LINKS, MORE_ACTION, NEW_TWEET_BUTTON_TEXT } from '../lib';
import styles from './LeftSidebar.module.scss';

export const LeftSidebar = () => {
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoadingInitialize);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <Link href={routes.app.home} aria-label='Home' className={styles.icon}>
          <TwitterLogoIcon width={40} height={33} />
        </Link>

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

        <Button
          onClick={() => {
            console.log('Open modal!');
          }}
          disabled={false}
          className={styles.newTweetButton}
          ariaLabel='add tweet'
        >
          <span className={styles.newTweetText}>{NEW_TWEET_BUTTON_TEXT}</span>
          <PlusIcon className={styles.plusIcon} width={14} height={14} />
        </Button>

        {isLoading ? (
          <UserSmallCardSkeleton
            className={clsx(styles.userSkeleton, 'hideUserInfoBelow1280')}
          />
        ) : (
          <UserSmallCard
            className={styles.user}
            user={user}
            isOwnProfile={true}
          />
        )}

        <LogoutButton className={styles.logoutButton}>
          <LogoutIcon
            width={18}
            height={18}
            className={styles.logoutButtonIcon}
          />
        </LogoutButton>
      </div>
    </aside>
  );
};
