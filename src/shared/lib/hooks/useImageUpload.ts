import { ChangeEvent, useState } from 'react';

import { MAX_IMAGE_SIZE } from '../image';

type UseImageUploadProps = {
  onFileChange: (file: File[] | File) => void;
};

export const useImageUpload = ({ onFileChange }: UseImageUploadProps) => {
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = MAX_IMAGE_SIZE;
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Not an image');
      } else if (file.size > maxSize) {
        setError('Max image size 5MB');
      } else {
        validFiles.push(file);
        setError('');
      }
    });

    if (validFiles.length > 0) {
      onFileChange(validFiles);
    }

    e.target.value = '';
  };

  return {
    handleChange,
    error,
    setError,
  };
};
