import { TwitterLogoIcon } from '../icon';
import styles from './GlobalLoader.module.scss';

export const GlobalLoader = () => {
  return (
    <div className={styles.loader}>
      <TwitterLogoIcon width={42} height={42} />
    </div>
  );
};
