'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useImageUpload } from '@/shared/lib/hooks';
import { MAX_IMAGES, MB } from '@/shared/lib/image';

export const useModalPostImages = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const removeImage = useCallback(
    (index: number) => {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
      setError('');
      setUploadError('');
    },
    [setUploadError],
  );

  const resetImages = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setImageFiles([]);
    setError('');
    setUploadError('');
    setUploadProgress(0);
  }, [previews, setUploadError]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const combinedError = error || imageUploadError;
  const imagesSize = useMemo(() => {
    const totalBytes = imageFiles.reduce((acc, cur) => acc + cur.size, 0);
    return (totalBytes / MB / MB).toFixed(2);
  }, [imageFiles]);

  return {
    imageFiles,
    previews,
    uploadProgress,
    error: combinedError,
    imagesSize,
    handleChange,
    removeImage,
    resetImages,
  };
};
