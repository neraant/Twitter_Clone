'use client';

import { useState } from 'react';

import { useLockBodyScroll } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button/Button';
import { PlusIcon } from '@/shared/ui/icon';
import { AddPostModal } from '@/widgets/add-post-modal';

import { NEW_TWEET_BUTTON_TEXT } from '../lib';
import styles from './OpenPostModalButton.module.scss';

export const OpenPostModalButton = () => {
  const [isModalOpen, setiIModalOpened] = useState(false);
  useLockBodyScroll(isModalOpen);

  const handleOpenModal = () => setiIModalOpened(true);

  const handleCloseModal = () => setiIModalOpened(false);

  return (
    <>
      <Button
        disabled={false}
        className={styles.newTweetButton}
        ariaLabel='add tweet'
        onClick={handleOpenModal}
      >
        <span className={styles.newTweetText}>{NEW_TWEET_BUTTON_TEXT}</span>
        <PlusIcon className={styles.plusIcon} width={14} height={14} />
      </Button>

      {isModalOpen && <AddPostModal onClose={handleCloseModal} />}
    </>
  );
};
