import clsx from 'clsx';
import { useState } from 'react';

import styles from './ToggleThemeButton.module.scss';

export const ToggleThemeButton = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      data-testid='theme-wrapper'
      data-theme={theme}
      className={clsx(styles.toggleWrapper, {
        [styles.toggled]: isDark,
      })}
      onClick={handleToggleTheme}
    >
      <div
        className={clsx(styles.circle, {
          [styles.toggled]: isDark,
        })}
      />
    </button>
  );
};
