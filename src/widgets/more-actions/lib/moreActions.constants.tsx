import { LogoutIcon, ThemeIcon } from '@/shared/ui/icon';

export const LOGOUT_ACTION = 'logout';
export const THEME_ACTION = 'theme';

export const ACTIONS = [
  {
    label: 'Toggle theme',
    action: THEME_ACTION,
    icon: <ThemeIcon width={18} height={18} />,
  },
  {
    label: 'Logout',
    action: LOGOUT_ACTION,
    icon: <LogoutIcon width={18} height={18} />,
  },
];
