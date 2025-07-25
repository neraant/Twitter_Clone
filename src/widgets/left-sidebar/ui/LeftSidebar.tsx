import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';

import { UserSmallCardSkeleton } from '@/entities/user';
import { UserSmallCardServer } from '@/entities/user/ui/UserSmallCard/UserSmallCardServer';
import { LogoutButton } from '@/features/auth';
import { routes } from '@/shared/config/routes';
import { Button } from '@/shared/ui/button/Button';
import { LogoutIcon, PlusIcon, TwitterLogoIcon } from '@/shared/ui/icon';

import { NEW_TWEET_BUTTON_TEXT } from '../lib';
import styles from './LeftSidebar.module.scss';
import { LeftSidebarNavigation } from './LeftSidebarNavigation';

export const LeftSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <Link href={routes.app.home} aria-label='Home' className={styles.icon}>
          <TwitterLogoIcon width={40} height={33} />
        </Link>

        <LeftSidebarNavigation />

        <Button
          disabled={false}
          className={styles.newTweetButton}
          ariaLabel='add tweet'
        >
          <span className={styles.newTweetText}>{NEW_TWEET_BUTTON_TEXT}</span>
          <PlusIcon className={styles.plusIcon} width={14} height={14} />
        </Button>

        <Suspense
          fallback={
            <UserSmallCardSkeleton
              className={clsx(styles.userSkeleton, 'hideUserInfoBelow1280')}
            />
          }
        >
          <UserSmallCardServer className={styles.user} />
        </Suspense>

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
