'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import styles from './SignTypeButton.module.scss';

type Props = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
};

export const SignTypeButton = ({
  label,
  href,
  onClick,
  disabled = false,
  children,
}: Props) => {
  const className = `${styles.button} ${disabled ? styles.disabled : ''}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={label}
    >
      {children}
      {label}
    </button>
  );
};
