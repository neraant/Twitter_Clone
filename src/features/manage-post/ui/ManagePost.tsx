'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { routes } from '@/shared/config/routes';
import { useClickOutside, useLockBodyScroll } from '@/shared/lib/hooks';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { DotsIcon } from '@/shared/ui/icon';

import { DELETE_ACTION, MANAGE_ACTIONS, useDeletePost } from '../lib';
import styles from './ManagePost.module.scss';

type ManagePostProps = {
  postId: string;
  currentUserId: string;
  className?: string;
};

export const ManagePost = ({
  postId,
  currentUserId,
  className,
}: ManagePostProps) => {
  const router = useRouter();
  const route = usePathname();

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const toggleManage = () => {
    setIsManageOpen((prev) => !prev);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmDelete(false);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmDelete(true);
  };

  const handleManageAction = (action: string) => {
    switch (action) {
      case DELETE_ACTION:
        handleOpenConfirmModal();
        break;
      default:
        break;
    }
  };

  const handleDeletePost = useDeletePost(postId, currentUserId, () => {
    toggleManage();
    handleCloseConfirmModal();

    if (route.includes(routes.app.post)) {
      router.back();
    }
  });

  const manageRef = useClickOutside<HTMLDivElement>({
    handleOnClickOutside: () => setIsManageOpen(false),
  });
  useLockBodyScroll(isConfirmDelete);

  return (
    <>
      {isConfirmDelete && (
        <ConfirmModal
          title='Delete post'
          description='Are you sure you want to delete this post? This action cannot be undone.'
          actionButtonLabel='Delete'
          onClose={handleCloseConfirmModal}
          onConfirm={handleDeletePost}
          className='confirmDelete'
        />
      )}

      <div
        className={clsx(styles.manageWrapper, className)}
        ref={manageRef}
        data-testid='manage-post'
      >
        <button type='button' aria-label='manage post' onClick={toggleManage}>
          <DotsIcon width={20} height={20} className={styles.manageIcon} />
        </button>

        {isManageOpen && (
          <div className={styles.manageModal}>
            {MANAGE_ACTIONS.map(({ label, icon, className, action }) => (
              <button
                key={`post_${action}`}
                type='button'
                onClick={() => handleManageAction(action)}
                className={clsx(styles.manageListButton, className)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
