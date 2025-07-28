'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { ImagePreview } from '@/entities/post';
import { useImageUpload } from '@/shared/lib/hooks';
import { MB } from '@/shared/lib/image';

import { MAX_IMAGES } from './addPostForm.constants';

export const usePostImages = () => {
  const [imageItems, setImageItems] = useState<ImagePreview[]>([]);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

      const spaceLeft = MAX_IMAGES - imageItems.length;

      if (spaceLeft === 0 || newFiles.length > 5)
        setError('You can upload 5 files maximum');

      const filesToAdd = newFiles.slice(0, spaceLeft);

      const newImageItems: ImagePreview[] = filesToAdd.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));

      setImageItems((prev) => [...prev, ...newImageItems]);
    },
  });

  const removeImage = useCallback(
    (index: number) => {
      setImageItems((prev) => {
        const itemToRemove = prev[index];
        if (itemToRemove) {
          URL.revokeObjectURL(itemToRemove.url);
        }
        return prev.filter((_, i) => i !== index);
      });
      setError('');
      setUploadError('');
    },
    [setUploadError],
  );

  const resetImages = useCallback(() => {
    imageItems.forEach((item) => URL.revokeObjectURL(item.url));
    setImageItems([]);
    setError('');
    setUploadError('');
    setUploadProgress(0);
  }, [imageItems, setUploadError]);

  const updateUploadProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const setUploadingStatus = useCallback((status: boolean) => {
    setIsUploading(status);
  }, []);

  useEffect(() => {
    return () => {
      imageItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [imageItems]);

  const combinedError = error || imageUploadError;

  const imageFiles = useMemo(
    () => imageItems.map((item) => item.file),
    [imageItems],
  );
  const previews = useMemo(
    () => imageItems.map((item) => item.url),
    [imageItems],
  );
  const previewItems = useMemo(() => imageItems, [imageItems]);

  const imagesSize = useMemo(() => {
    const totalBytes = imageFiles.reduce((acc, cur) => acc + cur.size, 0);
    return (totalBytes / MB / MB).toFixed(2);
  }, [imageFiles]);

  return {
    imageFiles,
    previews,
    previewItems,
    uploadProgress,
    isUploading,
    error: combinedError,
    imagesSize,
    handleChange,
    removeImage,
    resetImages,
    updateUploadProgress,
    setUploadingStatus,
  };
};
