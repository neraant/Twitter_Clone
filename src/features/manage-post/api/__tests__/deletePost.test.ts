import { createClient } from '@/shared/api/supabase/server';

import { deletePostAction } from '../deletePost';

jest.mock('@/shared/api/supabase/server');

describe('deletePostAction', () => {
  const mockEq = jest.fn();
  const mockUpdate = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({ update: mockUpdate }));
  const mockSupabase = { from: mockFrom };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('calls supabase to update post with is_deleted=true', async () => {
    mockEq.mockResolvedValue({ error: null });

    await deletePostAction('post-id-123');

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockUpdate).toHaveBeenCalledWith({ is_deleted: true });
    expect(mockEq).toHaveBeenCalledWith('id', 'post-id-123');
  });

  it('throws error when supabase returns an error', async () => {
    mockEq.mockResolvedValue({ error: { message: 'some error' } });

    await expect(deletePostAction('post-id-123')).rejects.toThrow(
      'Post deleting failed',
    );
  });
});
