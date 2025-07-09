import { ChangeEvent } from 'react';

import { MAX_IMAGE_SIZE } from '../image';

type UseImageUploadProps = {
  onFileChange: (file: File[] | File) => void;
};

export const useImageUpload = ({ onFileChange }: UseImageUploadProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = MAX_IMAGE_SIZE;
    const validFiles: File[] = Array.from(files).filter(
      (file) => file.type.startsWith('image/') && file.size <= maxSize,
    );

    if (validFiles.length > 0) {
      onFileChange(validFiles);
    }

    e.target.value = '';
  };

  return {
    handleChange,
  };
};
