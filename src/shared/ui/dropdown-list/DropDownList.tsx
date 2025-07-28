'use client';

import { useState } from 'react';

import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';

import { DropdownIcon } from '../icon';
import styles from './DropDownList.module.scss';

type DropDownListProps = {
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  selected?: string;
};

const DEFAULT_PLACEHOLDER = 'Select...';

export const DropDownList = ({
  options,
  placeholder = DEFAULT_PLACEHOLDER,
  onSelect,
  selected,
}: DropDownListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const ref = useClickOutside<HTMLDivElement>({
    handleOnClickOutside: handleClose,
  });

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type='button'
        onClick={handleOpen}
        className={`${styles.label} ${isOpen ? styles.active : ''}`}
      >
        {selected || placeholder}
        <DropdownIcon className={styles.icon} width={28} height={28} />
      </button>

      <ul className={`${styles.options} ${isOpen ? styles.active : ''}`}>
        {options.map((option) => (
          <li
            className={styles.option}
            key={option}
            onClick={() => handleSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
