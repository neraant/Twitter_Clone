import { act, renderHook } from '@testing-library/react';

import { usePosts } from '@/entities/post/lib';
import { useToast } from '@/shared/lib/toast';

import { useDeletePost } from '../useDeletePost';

jest.mock('@/entities/post/lib');
jest.mock('@/shared/lib/toast');

const mockUsePosts = usePosts as jest.MockedFunction<typeof usePosts>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('useDeletePost', () => {
  const mockDeletePost = {
    mutateAsync: jest.fn(),
  };
  const mockShowToast = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePosts.mockReturnValue({
      deletePost: mockDeletePost,
    } as never);
    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
    });
  });

  it('should return delete handler function', () => {
    const { result } = renderHook(() =>
      useDeletePost('post-123', 'user-456', mockOnDelete),
    );

    expect(typeof result.current).toBe('function');
  });

  it('should successfully delete post and show success toast', async () => {
    mockDeletePost.mutateAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useDeletePost('post-123', 'user-456', mockOnDelete),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockDeletePost.mutateAsync).toHaveBeenCalledWith('post-123');
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      'Success',
      'The post has been successfully deleted',
      'success',
    );
  });

  it('should handle string error and show error toast', async () => {
    const errorMessage = 'Failed to delete post';
    mockDeletePost.mutateAsync.mockRejectedValue(errorMessage);

    const { result } = renderHook(() =>
      useDeletePost('post-123', 'user-456', mockOnDelete),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockDeletePost.mutateAsync).toHaveBeenCalledWith('post-123');
    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Error', errorMessage, 'error');
  });

  it('should handle non-string error without showing toast', async () => {
    const errorObject = new Error('Network error');
    mockDeletePost.mutateAsync.mockRejectedValue(errorObject);

    const { result } = renderHook(() =>
      useDeletePost('post-123', 'user-456', mockOnDelete),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockDeletePost.mutateAsync).toHaveBeenCalledWith('post-123');
    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('should call usePosts with correct currentUserId', () => {
    renderHook(() => useDeletePost('post-123', 'user-456', mockOnDelete));

    expect(mockUsePosts).toHaveBeenCalledWith('user-456');
  });
});
