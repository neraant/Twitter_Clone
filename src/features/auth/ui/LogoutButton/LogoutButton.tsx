'use client';

import clsx from 'clsx';
import { ReactNode, useState } from 'react';

import { useLogout } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button/Button';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { Loader } from '@/shared/ui/loader';

import styles from './LogoutButton.module.scss';

const LOGOUT_TEXT = 'Logout';

type LogoutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export const LogoutButton = ({ className, children }: LogoutButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, handleLogout } = useLogout();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          title='Confirm logout'
          description='Are you sure you wanna logout?'
          actionButtonLabel='Logout'
          onClose={handleCloseModal}
          onConfirm={handleLogout}
        />
      )}

      <Button
        onClick={handleOpenModal}
        disabled={isLoading}
        className={clsx(styles.logoutButton, className)}
        ariaLabel='Logout'
      >
        <span className={styles.logoutButtonText}>{LOGOUT_TEXT}</span>
        {!isLoading && children}
        {isLoading && <Loader />}
      </Button>
    </>
  );
};
