import React from 'react';
import backIcon from '@assets/icons/back_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const BackIcon = ({ size = 24, className }: Props) => (
  <Image
    src={backIcon}
    alt='back'
    width={size}
    height={size}
    className={className}
  />
);
