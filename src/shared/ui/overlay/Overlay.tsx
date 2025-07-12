'use client';

import { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import styles from './Overlay.module.scss';

type OverlayProps = {
  children: ReactNode;
  onClickOutside?: (event: MouseEvent) => void;
  isClosing: boolean;
};

export const Overlay = ({
  children,
  onClickOutside,
  isClosing,
}: OverlayProps) => {
  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget && onClickOutside) {
      onClickOutside(event);
    }
  };

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>,
    document.body,
  );
};
