import { renderHook } from '@testing-library/react';
import { act } from 'react';

import * as postLib from '@/entities/post/lib';
import * as imageUploader from '@/features/image-uploader/lib';
import * as toastLib from '@/shared/lib/toast';

import { usePostForm } from '../usePostForm';

jest.mock('@/entities/post/lib');
jest.mock('@/features/image-uploader/lib');
jest.mock('@/shared/lib/toast');
jest.mock('../usePostImages', () => ({
  usePostImages: () => ({
    previews: [],
    error: null,
    imageFiles: [new File(['dummy'], 'dummy.png', { type: 'image/png' })],
    uploadProgress: 0,
    isUploading: false,
    imagesSize: '0.00',
    previewItems: [],
    handleChange: jest.fn(),
    removeImage: jest.fn(),
    resetImages: jest.fn(),
    updateUploadProgress: jest.fn(),
    setUploadingStatus: jest.fn(),
  }),
}));

describe('usePostForm', () => {
  const userId = 'user-1';
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (toastLib.useToast as jest.Mock).mockReturnValue({ showToast: jest.fn() });
    (postLib.usePosts as jest.Mock).mockReturnValue({
      addPost: { mutateAsync: jest.fn() },
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePostForm({ userId, onSuccess }));

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.imagesSize).toBe((0).toFixed(2));
  });

  it('should handle successful post submission without images', async () => {
    const addPostMock = {
      mutateAsync: jest.fn().mockResolvedValue(undefined),
    };
    (postLib.usePosts as jest.Mock).mockReturnValue({ addPost: addPostMock });
    (imageUploader.uploadMultipleImagesAction as jest.Mock).mockResolvedValue({
      success: true,
      results: [],
    });
    const showToast = jest.fn();
    (toastLib.useToast as jest.Mock).mockReturnValue({ showToast });

    const { result } = renderHook(() => usePostForm({ userId, onSuccess }));

    await act(async () => {
      await result.current.onSubmit({ content: 'Hello world' });
    });

    expect(addPostMock.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello world',
        author_id: userId,
        image_urls: [],
      }),
    );
    expect(showToast).toHaveBeenCalledWith(
      'Success',
      'Post created successfully!',
      'success',
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should do nothing if no userId', async () => {
    const { result } = renderHook(() => usePostForm({ userId: '' }));

    await act(async () => {
      await result.current.onSubmit({ content: 'Hello world' });
    });
  });

  it('should handle upload error', async () => {
    const addPostMock = { mutateAsync: jest.fn() };
    (postLib.usePosts as jest.Mock).mockReturnValue({ addPost: addPostMock });

    (imageUploader.uploadMultipleImagesAction as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Upload failed',
    });

    const showToast = jest.fn();
    (toastLib.useToast as jest.Mock).mockReturnValue({ showToast });

    const { result } = renderHook(() => usePostForm({ userId, onSuccess }));

    await act(async () => {
      await result.current.onSubmit({ content: 'Hello world' });
    });

    expect(addPostMock.mutateAsync).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('Error', 'Upload failed', 'error');
  });
});
