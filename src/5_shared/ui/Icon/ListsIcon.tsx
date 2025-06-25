import React from 'react';
import listsIcon from '@assets/icons/lists_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const ListsIcon = ({ size = 24, className }: Props) => (
  <Image
    src={listsIcon}
    alt='list'
    width={size}
    height={size}
    className={className}
  />
);
