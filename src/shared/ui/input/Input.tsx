import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

import { SearchIcon } from '../icon';
import styles from './Input.module.scss';

type InputProps = {
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  dataTestId?: string;
};

export const Input = ({
  placeholder,
  onChange,
  value,
  className,
  dataTestId = '',
}: InputProps) => {
  return (
    <div className={styles.wrapper}>
      <SearchIcon width={24} height={24} className={styles.icon} />
      <input
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={clsx(styles.input, className)}
        type='text'
        data-testid={dataTestId}
      />
    </div>
  );
};
