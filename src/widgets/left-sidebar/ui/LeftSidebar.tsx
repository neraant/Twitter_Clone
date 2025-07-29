import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';

import { UserSmallCardSkeleton } from '@/entities/user';
import { UserSmallCardServer } from '@/entities/user/ui/UserSmallCard/UserSmallCardServer';
import { LogoutButton } from '@/features/auth';
import { OpenPostModalButton } from '@/features/open-add-post-modal';
import { routes } from '@/shared/config/routes';
import { LogoutIcon, TwitterLogoIcon } from '@/shared/ui/icon';

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

        <OpenPostModalButton />

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
