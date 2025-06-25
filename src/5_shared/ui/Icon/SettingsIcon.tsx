import React from 'react';
import settingsIcon from '@assets/icons/settings_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const SettingsIcon = ({ size = 24, className }: Props) => (
  <Image
    src={settingsIcon}
    alt='settings'
    width={size}
    height={size}
    className={className}
  />
);
