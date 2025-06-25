import React from 'react';
import exploreIcon from '@assets/icons/explore_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const ExploreIcon = ({ size = 24, className }: Props) => (
  <Image
    src={exploreIcon}
    alt='explore'
    width={size}
    height={size}
    className={className}
  />
);
