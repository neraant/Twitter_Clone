import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { ChangeEvent } from 'react';

import { ImageIcon } from '@/shared/ui/icon';

import styles from './ImageUploader.module.scss';

type ImageUploaderProps = {
  label: string;
  imagePreview: string | StaticImageData | null;
  className?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const ImageUploader = ({
  label,
  imagePreview,
  className,
  handleChange,
}: ImageUploaderProps) => {
  return (
    <div className={clsx(styles.uploaderWrapper, className)}>
      <label htmlFor={label} className={styles.labelWrapper}>
        <input
          type='file'
          name={label}
          id={label}
          accept='image/*'
          onChange={handleChange}
          className={styles.inputHidden}
        />
        <div className={styles.labelContent}>
          <ImageIcon width={18} height={18} className={styles.icon} />
          <span className={styles.labelText}>{label}</span>
        </div>
      </label>

      {imagePreview && (
        <Image
          src={imagePreview}
          width={120}
          height={120}
          alt='Preview'
          className={clsx(styles.previewImage, className)}
        />
      )}
    </div>
  );
};
