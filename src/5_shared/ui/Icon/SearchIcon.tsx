import React from 'react';
import searchIcon from '@assets/icons/search_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const SearchIcon = ({ size = 24, className }: Props) => (
  <Image
    src={searchIcon}
    alt='search'
    width={size}
    height={size}
    className={className}
  />
);
