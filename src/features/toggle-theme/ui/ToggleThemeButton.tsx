'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useTheme } from '@/features/toggle-theme/lib';
import { THEMES } from '@/shared/lib/theme';

import styles from './ToggleThemeButton.module.scss';

export const ToggleThemeButton = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
  };

  if (!mounted) {
    return (
      <button
        className={styles.toggleWrapper}
        aria-label='Toggle theme'
        disabled
      >
        <div className={styles.circle} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={clsx(styles.toggleWrapper, isDark && styles.toggled)}
      aria-label='Toggle theme'
    >
      <div className={clsx(styles.circle, isDark && styles.toggled)} />
    </button>
  );
};
