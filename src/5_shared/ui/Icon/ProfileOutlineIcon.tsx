import React from 'react';
import profileOutlineIcon from '@assets/icons/profile-outline_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const ProfileOutlineIcon = ({ size = 24, className }: Props) => (
  <Image
    src={profileOutlineIcon}
    alt='profile'
    width={size}
    height={size}
    className={className}
  />
);
