import React from 'react';
import moreIcon from '@assets/icons/more_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const MoreIcon = ({ size = 24, className }: Props) => (
  <Image
    src={moreIcon}
    alt='more'
    width={size}
    height={size}
    className={className}
  />
);
