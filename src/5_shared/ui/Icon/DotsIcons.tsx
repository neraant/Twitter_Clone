import React from 'react';
import dotsIcon from '@assets/icons/dots_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const DotsIcon = ({ size = 24, className }: Props) => (
  <Image
    src={dotsIcon}
    alt='more'
    width={size}
    height={size}
    className={className}
  />
);
