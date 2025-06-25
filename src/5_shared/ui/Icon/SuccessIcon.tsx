import React from 'react';
import successIcon from '@assets/icons/success_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const SuccessIcon = ({ size = 24, className }: Props) => (
  <Image
    src={successIcon}
    alt='success'
    width={size}
    height={size}
    className={className}
  />
);
