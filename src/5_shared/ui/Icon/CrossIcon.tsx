import React from 'react';
import crossIcon from '@assets/icons/cross_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const CrossIcon = ({ size = 24, className }: Props) => (
  <Image
    src={crossIcon}
    alt='close'
    width={size}
    height={size}
    className={className}
  />
);
