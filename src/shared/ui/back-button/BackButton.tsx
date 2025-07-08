'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React from 'react';

import { BackIcon } from '../icon';

type BackButtonProps = {
  className?: string;
};

export const BackButton = ({ className }: BackButtonProps) => {
  const { back } = useRouter();

  return (
    <button
      onClick={back}
      className={clsx(className)}
      type='button'
      aria-label='back'
    >
      <BackIcon width={24} height={24} />
    </button>
  );
};
