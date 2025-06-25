import React from 'react';
import googleLogoIcon from '@assets/icons/google-logo_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const GoogleLogoIcon = ({ size = 24, className }: Props) => (
  <Image
    src={googleLogoIcon}
    alt='google'
    width={size}
    height={size}
    className={className}
  />
);
