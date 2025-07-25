'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import styles from './Overlay.module.scss';

type OverlayProps = {
  children: ReactNode;
  onClickOutside?: () => void;
  isClosing?: boolean;
};

export const Overlay = ({
  children,
  onClickOutside,
  isClosing,
}: OverlayProps) => {
  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
      onClick={onClickOutside}
    >
      {children}
    </div>,
    document.body,
  );
};
