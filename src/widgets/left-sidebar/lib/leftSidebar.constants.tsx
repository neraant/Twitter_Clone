import { routes } from '@/shared/config/routes';
import {
  BookmarksIcon,
  ExploreIcon,
  HomeOutlineIcon,
  ListsIcon,
  MessagesIcon,
  MoreIcon,
  NotificationIcon,
  ProfileOutlineIcon,
} from '@/shared/ui/icon';

import styles from '../ui/LeftSidebar.module.scss';

export const MORE_ACTION = 'more';

export const LINKS = [
  {
    href: routes.app.home,
    label: 'Home',
    icon: <HomeOutlineIcon width={28} height={28} />,
  },
  {
    href: routes.app.explore,
    label: 'Explore',
    icon: <ExploreIcon width={28} height={28} />,
  },
  {
    href: routes.app.notifications,
    label: 'Notifications',
    icon: <NotificationIcon width={28} height={28} />,
    className: styles.hideBelow768,
  },
  {
    href: routes.app.messages,
    label: 'Messages',
    icon: <MessagesIcon width={28} height={28} />,
    className: styles.hideBelow768,
  },
  {
    href: routes.app.bookmarks,
    label: 'Bookmarks',
    icon: <BookmarksIcon width={28} height={28} />,
  },
  {
    href: routes.app.lists,
    label: 'Lists',
    icon: <ListsIcon width={28} height={28} />,
  },
  {
    href: routes.app.profile,
    label: 'Profile',
    icon: <ProfileOutlineIcon width={28} height={28} />,
  },
  {
    label: 'More',
    icon: <MoreIcon width={28} height={28} />,
    action: MORE_ACTION,
    className: styles.hideOver768,
  },
];
