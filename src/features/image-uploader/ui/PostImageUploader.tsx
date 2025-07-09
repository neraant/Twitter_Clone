import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { ChangeEvent, ReactNode } from 'react';

import { CrossIcon, ImageIcon } from '@/shared/ui/icon';

import styles from './PostImageUploader.module.scss';

type PostImageUploaderProps = {
  label: string;
  imagePreviews: string[] | StaticImageData[] | null;
  className?: string;
  children?: ReactNode;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
};

export const PostImageUploader = ({
  label,
  imagePreviews,
  className,
  children,
  handleChange,
  onRemove,
}: PostImageUploaderProps) => {
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

      {imagePreviews && imagePreviews.length > 0 && (
        <div className={styles.previewImages}>
          {imagePreviews.map((src, index) => (
            <div key={index} className={styles.imageWrapper}>
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
          ))}
        </div>
      )}
    </div>
  );
};
