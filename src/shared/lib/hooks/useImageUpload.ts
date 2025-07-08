import { ChangeEvent, useState } from 'react';

type UseImageUploadProps = {
  onFileChange: (file: File | null) => void;
};

export const useImageUpload = ({ onFileChange }: UseImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('File size should be less than 5MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      onFileChange(file);
    } else {
      setImagePreview(null);
      onFileChange(null);
    }
  };

  return {
    imagePreview,
    handleChange,
  };
};
