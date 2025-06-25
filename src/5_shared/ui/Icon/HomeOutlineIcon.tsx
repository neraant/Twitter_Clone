import React from 'react';
import homeOutlineIcon from '@assets/icons/home-outline_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const HomeOutlineIcon = ({ size = 24, className }: Props) => (
  <Image
    src={homeOutlineIcon}
    alt='home'
    width={size}
    height={size}
    className={className}
  />
);
