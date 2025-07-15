'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { PostFetchingMode } from '@/entities/post';
import { routes } from '@/shared/config/routes';
import { useClickOutside } from '@/shared/lib/hooks';
import { useToast } from '@/shared/lib/toast';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { DotsIcon } from '@/shared/ui/icon';
import { usePosts } from '@/widgets/posts-list/lib';

import { deletePost } from '../api';
import { DELETE_ACTION, MANAGE_ACTIONS } from '../lib';
import styles from './ManagePost.module.scss';

type ManagePostProps = {
  postId: string;
  className?: string;
};

export const ManagePost = ({ postId, className }: ManagePostProps) => {
  const router = useRouter();
  const route = usePathname();

  const manageRef = useRef<HTMLDivElement>(null);

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const { showToast } = useToast();
  const { refreshPosts } = usePosts({ mode: PostFetchingMode.all });

  const handleOpenManage = () => {
    setIsManageOpen(true);
  };

  const handleCloseManage = () => {
    setIsManageOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmDelete(false);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmDelete(true);
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId);

      handleCloseConfirmModal();
      handleCloseManage();
      showToast('Success', 'The post has been successfully deleted', 'success');

      if (route.includes(routes.app.post)) {
        router.back();
      }
    } catch (error) {
      if (typeof error === 'string') {
        showToast('Error', error, 'error');
      }
    } finally {
      refreshPosts();
    }
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

  useClickOutside(manageRef, handleCloseManage);

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

      <div className={clsx(styles.manageWrapper, className)} ref={manageRef}>
        <button
          type='button'
          aria-label='manage post'
          onClick={isManageOpen ? handleCloseManage : handleOpenManage}
        >
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
