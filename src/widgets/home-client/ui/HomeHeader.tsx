import { ToggleThemeButton } from '@/features/toggle-theme';

import { HOME_TEXT } from '../lib';
import styles from './HomeClient.module.scss';

export const HomeHeader = () => {
  return (
    <div className={styles.homeHeaderWrapper}>
      <p className={styles.homeHeaderWrapperText}>{HOME_TEXT}</p>

      <ToggleThemeButton />
    </div>
  );
};
