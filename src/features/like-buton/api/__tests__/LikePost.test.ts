import { createClient } from '@/shared/api/supabase/server';

import { LikePost } from '../LikePost';

jest.mock('@/shared/api/supabase/server');

describe('LikePost', () => {
  const mockInsert = jest.fn();
  const mockDelete = jest.fn();
  const mockSingle = jest.fn();
  const mockEqSecond = jest.fn();
  const mockEqFirst = jest.fn();
  const mockSelect = jest.fn();
  const mockFrom = jest.fn();

  const mockSupabase = {
    from: mockFrom,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockFrom.mockReturnValue({
      select: mockSelect,
      delete: mockDelete,
      insert: mockInsert,
    });

    mockSelect.mockReturnValue({
      eq: mockEqFirst,
    });

    mockEqFirst.mockReturnValue({
      eq: mockEqSecond,
    });

    mockEqSecond.mockReturnValue({
      single: mockSingle,
    });

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('likes a post when no like exists', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    mockInsert.mockResolvedValue({ error: null });

    const result = await LikePost({ userId: 'user1', postId: 'post1' });

    expect(result).toEqual({ success: true, message: 'Liked successfully' });
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user1',
      post_id: 'post1',
    });
  });

  it('unlikes a post when like exists', async () => {
    mockSingle.mockResolvedValue({ data: { id: 'like-id' }, error: null });

    mockFrom.mockReturnValueOnce({
      select: mockSelect,
    });

    mockFrom.mockReturnValueOnce({
      delete: jest.fn(() => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      })),
    });

    const result = await LikePost({ userId: 'user1', postId: 'post1' });

    expect(result).toEqual({ success: true, message: 'Unliked successfully' });
  });

  it('throws error when select fails with unexpected error', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: 'OTHER_ERROR' },
    });

    await expect(
      LikePost({ userId: 'user1', postId: 'post1' }),
    ).rejects.toThrow('Could not check existing like');
  });

  it('throws error when insert fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    mockInsert.mockResolvedValue({ error: { message: 'insert failed' } });

    await expect(
      LikePost({ userId: 'user1', postId: 'post1' }),
    ).rejects.toThrow('Could not like post');
  });

  it('throws error when delete fails', async () => {
    mockSingle.mockResolvedValue({ data: { id: 'like-id' }, error: null });

    mockFrom.mockReturnValueOnce({
      select: mockSelect,
    });

    mockFrom.mockReturnValueOnce({
      delete: jest.fn(() => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: { message: 'delete failed' } }),
        }),
      })),
    });

    await expect(
      LikePost({ userId: 'user1', postId: 'post1' }),
    ).rejects.toThrow('Could not unlike post');
  });
});
