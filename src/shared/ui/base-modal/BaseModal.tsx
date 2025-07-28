'use client';

import clsx from 'clsx';
import { ReactNode, useState } from 'react';

import { useClickOutside } from '@/shared/lib/hooks';

import { Overlay } from '../overlay';
import styles from './BaseModal.module.scss';

type BaseModalProps = {
  children: ReactNode;
  className?: string;
  onClose: () => void;
};

export const BaseModal = ({ children, className, onClose }: BaseModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const ref = useClickOutside<HTMLDivElement>({
    handleOnClickOutside: handleClose,
  });

  function handleClose() {
    setIsClosing(true);
    setTimeout(onClose, 200);
  }

  return (
    <Overlay onClickOutside={handleClose} isClosing={isClosing}>
      <div
        ref={ref}
        className={clsx(styles.modal, className, isClosing && styles.closing)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Overlay>
  );
};
