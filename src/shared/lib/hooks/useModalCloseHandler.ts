import { RefObject, useCallback, useState } from 'react';

import { useClickOutside } from './useClickOutside';

export const useModalCloseHandler = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  delay: number = 200,
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
