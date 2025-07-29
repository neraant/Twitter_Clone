import React from 'react';

import { Button } from '@/shared/ui/button/Button';
import { Loader } from '@/shared/ui/loader';

import { CHANGE_BUTTON_TEXT } from '../lib/changePasswordButton.constants';

type ChangePasswordButtonProps = {
  isLoading: boolean;
  className?: string;
};

export const ChangePasswordButton = ({
  isLoading,
  className,
}: ChangePasswordButtonProps) => {
  return (
    <Button
      ariaLabel='change password'
      type='submit'
      className={className}
      disabled={isLoading}
    >
      {CHANGE_BUTTON_TEXT}
      {isLoading && <Loader />}
    </Button>
  );
};
