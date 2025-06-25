import React from 'react';
import errorIcon from '@assets/icons/error_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const ErrorIcon = ({ size = 24, className }: Props) => (
  <Image
    src={errorIcon}
    alt='error'
    width={size}
    height={size}
    className={className}
  />
);
