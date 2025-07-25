import clsx from 'clsx';

import { LoaderIcon } from '../icon';
import styles from './Loader.module.scss';

type LoaderProps = {
  size?: string;
  className?: string;
};

export const Loader = ({ size, className }: LoaderProps) => {
  return (
    <LoaderIcon
      className={clsx(styles.loader, className)}
      width={size ?? 18}
      height={size ?? 18}
    />
  );
};
