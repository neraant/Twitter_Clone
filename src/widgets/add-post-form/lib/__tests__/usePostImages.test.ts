import { act, renderHook } from '@testing-library/react';

import { MB } from '@/shared/lib/image';

import { usePostImages } from '../usePostImages';

beforeAll(() => {
  global.URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`);
  global.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

jest.mock('@/shared/lib/hooks', () => ({
  useImageUpload: ({
    onFileChange,
  }: {
    onFileChange: (files: File[] | File | null) => void;
  }) => {
    return {
      handleChange: (files: File | File[] | null) => {
        onFileChange(files);
      },
      error: '',
      setError: jest.fn(),
    };
  },
}));

describe('usePostImages', () => {
  it('initial state is correct', () => {
    const { result } = renderHook(() => usePostImages());

    expect(result.current.imageFiles).toEqual([]);
    expect(result.current.previews).toEqual([]);
    expect(result.current.error).toBe('');
    expect(result.current.imagesSize).toBe('0.00');
    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.isUploading).toBe(false);
  });

  it('adds image files and generates previews', () => {
    const { result } = renderHook(() => usePostImages());

    const file1 = new File(['abc'], 'file1.png', {
      type: 'image/png',
    });
    const file2 = new File(['def'], 'file2.jpg', {
      type: 'image/jpg',
    });
    Object.defineProperty(file1, 'size', { value: MB * MB * 2 });
    Object.defineProperty(file2, 'size', { value: MB * MB * 3 });

    act(() => {
      result.current.handleChange([file1, file2] as never);
    });

    expect(result.current.imageFiles.length).toBe(2);
    expect(result.current.previews).toEqual([
      `blob:file1.png`,
      `blob:file2.jpg`,
    ]);
    expect(result.current.imagesSize).toBe('5.00');
    expect(result.current.error).toBe('');
  });

  it('sets error if more than 5 files or no space left', () => {
    const { result } = renderHook(() => usePostImages());

    const files = Array(6)
      .fill(null)
      .map((_, i) => new File(['x'], `file${i}.png`));

    act(() => {
      result.current.handleChange(files as never);
    });

    expect(result.current.error).toBe('You can upload 5 files maximum');
  });

  it('removeImage removes file and revokes URL', () => {
    const { result } = renderHook(() => usePostImages());

    const file = new File(['x'], 'file.png');
    Object.defineProperty(file, 'size', { value: MB * MB });

    act(() => {
      result.current.handleChange(file as never);
    });

    expect(result.current.imageFiles.length).toBe(1);

    act(() => {
      result.current.removeImage(0);
    });

    expect(result.current.imageFiles.length).toBe(0);
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('resetImages clears all images and resets state', () => {
    const { result } = renderHook(() => usePostImages());

    const file = new File(['x'], 'file.png');
    Object.defineProperty(file, 'size', { value: MB * MB });

    act(() => {
      result.current.handleChange(file as never);
    });

    expect(result.current.imageFiles.length).toBe(1);

    act(() => {
      result.current.resetImages();
    });

    expect(result.current.imageFiles.length).toBe(0);
    expect(result.current.error).toBe('');
    expect(result.current.uploadProgress).toBe(0);
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('updateUploadProgress sets upload progress', () => {
    const { result } = renderHook(() => usePostImages());

    act(() => {
      result.current.updateUploadProgress(50);
    });

    expect(result.current.uploadProgress).toBe(50);
  });

  it('setUploadingStatus sets uploading state', () => {
    const { result } = renderHook(() => usePostImages());

    act(() => {
      result.current.setUploadingStatus(true);
    });

    expect(result.current.isUploading).toBe(true);
  });
});
