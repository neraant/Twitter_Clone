import { routes } from '@/shared/config/routes';

import { MessagesIcon, NotificationIcon } from '../../ui/icon/index';

export const HEADER_LINKS = [
  {
    href: routes.app.notifications,
    label: 'Notifications',
    icon: <NotificationIcon width={28} height={28} />,
  },
  {
    href: routes.app.messages,
    label: 'Messages',
    icon: <MessagesIcon width={28} height={28} />,
  },
];
