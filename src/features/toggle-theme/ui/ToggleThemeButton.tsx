import clsx from 'clsx';

import { THEMES } from '@/shared/lib/theme';

import { useTheme } from '../lib';
import styles from './ToggleThemeButton.module.scss';

export const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label={`Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} theme`}
      className={clsx(styles.toggleWrapper, {
        [styles.toggled]: theme === THEMES.DARK,
      })}
      onClick={toggleTheme}
    >
      <div
        className={clsx(styles.circle, {
          [styles.toggled]: theme === THEMES.DARK,
        })}
      />
    </button>
  );
};
