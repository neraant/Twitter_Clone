import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useImageUpload } from '../useImageUpload';

describe('useImageUpload', () => {
  const onFileChange = jest.fn();

  it('validates image files', () => {
    const { result } = renderHook(() => useImageUpload({ onFileChange }));

    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleChange({
        target: { files: [file], value: '' },
      } as never);
    });

    expect(onFileChange).toHaveBeenCalledWith([file]);
    expect(result.current.error).toBe('');
  });

  it('rejects non-image files', () => {
    const { result } = renderHook(() => useImageUpload({ onFileChange }));

    const file = new File([''], 'test.txt', { type: 'text/plain' });

    act(() => {
      result.current.handleChange({
        target: { files: [file], value: '' },
      } as never);
    });

    expect(result.current.error).toBe('Not an image');
  });

  it('rejects oversized files', () => {
    const { result } = renderHook(() => useImageUpload({ onFileChange }));

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleChange({
        target: { files: [largeFile], value: '' },
      } as never);
    });

    expect(result.current.error).toBe('Max image size 5MB');
  });
});
