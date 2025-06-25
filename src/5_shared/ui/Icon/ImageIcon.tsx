import React from 'react';
import imageIcon from '@assets/icons/image_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const ImageIcon = ({ size = 24, className }: Props) => (
  <Image
    src={imageIcon}
    alt='image'
    width={size}
    height={size}
    className={className}
  />
);
