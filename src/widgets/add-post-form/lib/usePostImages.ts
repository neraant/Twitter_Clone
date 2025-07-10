'use client';

import { useState } from 'react';

import { useImageUpload } from '@/shared/lib/hooks';

import { MAX_IMAGES } from './addPostForm.constants';

export const usePostImages = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');

  const {
    handleChange,
    error: imageUploadError,
    setError: setUploadError,
  } = useImageUpload({
    onFileChange: (newFiles) => {
      if (!newFiles) return;

      if (!Array.isArray(newFiles)) {
        newFiles = [newFiles];
      }

      const spaceLeft = MAX_IMAGES - imageFiles.length;

      if (spaceLeft === 0 || newFiles.length > 5)
        setError('You can upload 5 files maximum');

      const filesToAdd = newFiles.slice(0, spaceLeft);

      setImageFiles((prev) => [...prev, ...filesToAdd]);
      setPreviews((prev) => [
        ...prev,
        ...filesToAdd.map((file) => URL.createObjectURL(file)),
      ]);
    },
  });

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setError('');
    setUploadError('');
  };

  const resetImages = () => {
    setPreviews([]);
    setImageFiles([]);
    setError('');
    setUploadError('');
  };

  const combinedError = error || imageUploadError;

  return {
    imageFiles,
    previews,
    error: combinedError,
    handleChange,
    removeImage,
    resetImages,
  };
};
