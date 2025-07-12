import { MouseEvent, RefObject, useCallback, useState } from 'react';

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

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClose();
      }
    },
    [handleClose, ref],
  );

  return { isClosing, handleClose, handleClickOutside };
};
