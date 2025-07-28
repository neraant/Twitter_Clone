'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { Post } from '@/entities/post';
import { ImagePreview } from '@/entities/post/ui/PostCard';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';
import { useAuthStore } from '@/features/auth';
import { useModal } from '@/shared/lib/hooks';
import { CrossIcon } from '@/shared/ui/icon';
import { Overlay } from '@/shared/ui/overlay';

import {
  ADD_POST_TITLE,
  DEFAULT_CONTENT,
  PREVIEW_TITLE,
} from '../lib/addPostModal.constants';
import styles from './AddPostModal.module.scss';
import { AddPostModalForm } from './AddPostModalForm';

type AddPostModalProps = {
  onClose: () => void;
};

export const AddPostModal = ({ onClose }: AddPostModalProps) => {
  const [previewData, setPreviewData] = useState<{
    content: string;
    previewItems: ImagePreview[];
  }>({ content: '', previewItems: [] });

  const {
    isClosing,
    handleClose,
    ref: modalRef,
  } = useModal<HTMLDivElement>({ onClose });
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const mockPost: Post = {
    id: 'preview',
    author_avatar: user.avatar_url,
    created_at: new Date().toISOString(),
    author_name: user.name,
    author_id: user.id,
    content: previewData.content || DEFAULT_CONTENT,
    image_urls: previewData.previewItems.map((item) => item.url),
    is_deleted: false,
  };

  return (
    <Overlay isClosing={isClosing} onClickOutside={handleClose}>
      <div
        ref={modalRef}
        className={clsx(
          styles.addPostModalWrapper,
          isClosing && styles.closing,
        )}
      >
        <button type='button' aria-label='close' onClick={handleClose}>
          <CrossIcon
            width={18}
            height={18}
            className={styles.modalCloseButton}
          />
        </button>

        <h3 className={styles.modalTitle}>{ADD_POST_TITLE}</h3>

        <div className={styles.content}>
          <AddPostModalForm
            userId={user?.id}
            onSuccess={handleClose}
            onFormDataChange={setPreviewData}
          />

          <h5 className={styles.previewTitle}>{PREVIEW_TITLE}</h5>

          <PostCard post={mockPost} currentUserId={user.id} isPreview />
        </div>
      </div>
    </Overlay>
  );
};
