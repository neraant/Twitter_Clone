import clsx from 'clsx';

import styles from './Skeleton.module.scss';

type SkeletonProps = {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
};

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  radius = '4px',
  className = '',
}: SkeletonProps) => {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius }}
    />
  );
};
