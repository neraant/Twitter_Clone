import { useEffect, useRef } from 'react';

type useClickOutsideProps = {
  handleOnClickOutside: (event: MouseEvent | TouchEvent) => void;
  active?: boolean;
};

export const useClickOutside = <T extends HTMLElement = HTMLElement>({
  handleOnClickOutside,
  active = true,
}: useClickOutsideProps) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handleOnClickOutside(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [active, handleOnClickOutside]);

  return ref;
};
