import { createClient } from '@/shared/api/supabase/server';

import { getUserPostsCount } from '../getUserPostsCount';

jest.mock('@/shared/api/supabase/server');

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe('getUserPostsCount', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as never);
  });

  it('should return posts count for user', async () => {
    mockSupabase.eq.mockResolvedValue({
      count: 5,
      error: null,
    });

    const result = await getUserPostsCount('user-123');

    expect(mockSupabase.from).toHaveBeenCalledWith(
      'post_with_author_and_likes',
    );
    expect(mockSupabase.select).toHaveBeenCalledWith('*', {
      count: 'exact',
      head: true,
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith('author_id', 'user-123');
    expect(result).toBe(5);
  });

  it('should return 0 when count is null', async () => {
    mockSupabase.eq.mockResolvedValue({
      count: null,
      error: null,
    });

    const result = await getUserPostsCount('user-123');

    expect(result).toBe(0);
  });

  it('should throw error when supabase returns error', async () => {
    const mockError = new Error('Database error');
    mockSupabase.eq.mockResolvedValue({
      count: null,
      error: mockError,
    });

    await expect(getUserPostsCount('user-123')).rejects.toThrow(
      'Database error',
    );
  });
});
