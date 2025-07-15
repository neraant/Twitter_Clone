'use client';

import clsx from 'clsx';

import { useTheme } from '@/features/toggle-theme/lib';
import { THEMES } from '@/shared/lib/theme';

import styles from './ToggleThemeButton.module.scss';

export const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

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
