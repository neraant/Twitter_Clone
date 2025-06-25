import React from 'react';
import twitterLogoIcon from '@assets/icons/twitter-logo_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const TwitterLogoIcon = ({ size = 24, className }: Props) => (
  <Image
    src={twitterLogoIcon}
    alt='twitter'
    width={size}
    height={size}
    className={className}
  />
);
