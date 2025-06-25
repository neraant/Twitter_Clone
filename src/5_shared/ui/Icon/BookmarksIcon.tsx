import React from 'react';
import bookmarksIcon from '@assets/icons/bookmarks_icon.svg';
import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export const BookmarksIcon = ({ size = 24, className }: Props) => (
  <Image
    src={bookmarksIcon}
    alt='bookmarks'
    width={size}
    height={size}
    className={className}
  />
);
