'use client';

import { useCallback, useState } from 'react';

import { useClickOutside } from './useClickOutside';

type useModalProps = {
  onClose: () => void;
  delay?: number;
  isActive?: boolean;
};

const DEFAULT_DELAY = 200;

export const useModal = <T extends HTMLElement = HTMLElement>({
  onClose,
  isActive = true,
  delay = DEFAULT_DELAY,
}: useModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, delay);
  }, [onClose, delay]);

  const ref = useClickOutside<T>({
    handleOnClickOutside: handleClose,
    active: isActive,
  });

  return { ref, isClosing, handleClose };
};
