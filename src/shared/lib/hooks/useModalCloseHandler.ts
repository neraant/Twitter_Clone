import { RefObject, useCallback, useState } from 'react';

import { useClickOutside } from './useClickOutside';

const DEFAULT_DELAY = 200;

export const useModalCloseHandler = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  delay: number = DEFAULT_DELAY,
) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, delay);
  }, [onClose, delay]);

  useClickOutside(ref, handleClose);

  return { isClosing, handleClose };
};
