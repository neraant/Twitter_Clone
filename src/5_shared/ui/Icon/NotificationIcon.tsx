import React from 'react';
import notificationIcon from '@assets/icons/notification_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const NotificationIcon = ({ size = 24, className }: Props) => (
  <Image
    src={notificationIcon}
    alt='notification'
    width={size}
    height={size}
    className={className}
  />
);
