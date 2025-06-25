import React from 'react';
import messagesIcon from '@assets/icons/messages_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const MessagesIcon = ({ size = 24, className }: Props) => (
  <Image
    src={messagesIcon}
    alt='messages'
    width={size}
    height={size}
    className={className}
  />
);
