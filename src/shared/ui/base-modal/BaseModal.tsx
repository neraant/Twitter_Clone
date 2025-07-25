'use client';

import { ReactNode, useRef, useState } from 'react';

import { useClickOutside } from '@/shared/lib/hooks';

import { Overlay } from '../overlay';
import styles from './BaseModal.module.scss';

type BaseModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export const BaseModal = ({ children, onClose }: BaseModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useClickOutside(ref, handleClose);

  function handleClose() {
    setIsClosing(true);
    setTimeout(onClose, 200);
  }

  return (
    <Overlay onClickOutside={handleClose} isClosing={isClosing}>
      <div
        ref={ref}
        className={`${styles.modal} ${isClosing ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Overlay>
  );
};
