import React from 'react';
import loaderIcon from '@assets/icons/loader_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const LoaderIcon = ({ size = 24, className }: Props) => (
  <Image
    src={loaderIcon}
    alt='loading'
    width={size}
    height={size}
    className={className}
  />
);
