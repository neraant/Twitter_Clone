import React from 'react';
import eyeCrossedIcon from '@assets/icons/eye-crossed_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const EyeCrossedIcon = ({ size = 24, className }: Props) => (
  <Image
    src={eyeCrossedIcon}
    alt='show password'
    width={size}
    height={size}
    className={className}
  />
);
