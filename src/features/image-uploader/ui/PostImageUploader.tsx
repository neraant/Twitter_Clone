import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { ChangeEvent, ReactNode } from 'react';

import { ImagePreview } from '@/entities/post';
import { CrossIcon, ImageIcon } from '@/shared/ui/icon';

import { getImageKey, getImageSrc } from '../lib/getImageOptions.utils';
import styles from './PostImageUploader.module.scss';

type PostImageUploaderProps = {
  label: string;
  imagePreviews?: string[] | StaticImageData[] | null;
  previewItems?: ImagePreview[];
  className?: string;
  children?: ReactNode;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
};

export const PostImageUploader = ({
  label,
  imagePreviews,
  previewItems,
  className,
  children,
  handleChange,
  onRemove,
}: PostImageUploaderProps) => {
  const items = previewItems || imagePreviews;

  return (
    <div className={styles.uploaderWrapper}>
      <label htmlFor={label} className={styles.labelWrapper}>
        <input
          type='file'
          name={label}
          id={label}
          accept='image/*'
          onChange={handleChange}
          className={styles.inputHidden}
          multiple
        />
        <div className={clsx(styles.content, className)}>
          <ImageIcon width={22} height={22} className={styles.icon} />
          {children}
        </div>
      </label>

      {items?.length ? (
        <div className={styles.previewImages}>
          {items.map((item, index) => {
            const src = getImageSrc(item);
            const key = getImageKey(item, index, previewItems);

            return (
              <div key={key} className={styles.imageWrapper}>
                <button
                  type='button'
                  onClick={() => onRemove(index)}
                  className={styles.removeButton}
                >
                  <CrossIcon width={16} height={16} />
                </button>
                <Image
                  src={src}
                  width={70}
                  height={70}
                  alt='Preview'
                  className={styles.previewImage}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
