import React from 'react';
import likeIcon from '@assets/icons/like_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const LikeIcon = ({ size = 24, className }: Props) => (
  <Image
    src={likeIcon}
    alt='like'
    width={size}
    height={size}
    className={className}
  />
);
