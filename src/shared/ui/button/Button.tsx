import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from './Button.module.scss';

type ButtonType = 'submit' | 'button';

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: ButtonType;
  ariaLabel: string;
  children?: ReactNode;
};

export const Button = ({
  onClick,
  disabled = false,
  className,
  type = 'button',
  ariaLabel,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, className)}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
