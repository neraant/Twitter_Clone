import { createClient } from '@/shared/api/supabase/server';

import { getAllPostsPaginated } from '../getAllPostsPaginated';

jest.mock('@/shared/api/supabase/server');

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe('getAllPostsPaginated', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
  };

  const mockPosts = [
    { id: '1', created_at: '2023-01-02T00:00:00Z', content: 'Post 1' },
    { id: '2', created_at: '2023-01-01T00:00:00Z', content: 'Post 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as never);
    console.error = jest.fn();
  });

  it('should return paginated posts without cursor', async () => {
    mockSupabase.limit.mockResolvedValue({
      data: mockPosts,
      error: null,
    });

    const result = await getAllPostsPaginated(null);

    expect(mockSupabase.from).toHaveBeenCalledWith(
      'post_with_author_and_likes',
    );
    expect(mockSupabase.select).toHaveBeenCalledWith('*');
    expect(mockSupabase.eq).toHaveBeenCalledWith('is_deleted', false);
    expect(mockSupabase.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
    expect(result).toEqual({
      posts: mockPosts,
      hasMore: false,
      nextCursor: '2023-01-01T00:00:00Z',
    });
  });

  it('should not filter by userId when userId is global', async () => {
    mockSupabase.limit.mockResolvedValue({
      data: mockPosts,
      error: null,
    });

    await getAllPostsPaginated(null, 'global');

    expect(mockSupabase.eq).not.toHaveBeenCalledWith('author_id', 'global');
  });

  it('should return hasMore true when posts length equals limit', async () => {
    const fullLimitPosts = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      created_at: `2023-01-0${i + 1}T00:00:00Z`,
      content: `Post ${i + 1}`,
    }));

    mockSupabase.limit.mockResolvedValue({
      data: fullLimitPosts,
      error: null,
    });

    const result = await getAllPostsPaginated(null);

    expect(result.hasMore).toBe(true);
  });

  it('should return empty array when no data', async () => {
    mockSupabase.limit.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await getAllPostsPaginated(null);

    expect(result).toEqual({
      posts: [],
      hasMore: false,
      nextCursor: null,
    });
  });

  it('should throw error when supabase returns error', async () => {
    const mockError = { message: 'Database error' };
    mockSupabase.limit.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(getAllPostsPaginated(null)).rejects.toThrow('Database error');
    expect(console.error).toHaveBeenCalledWith('Supabase error:', mockError);
  });

  it('should handle unexpected errors', async () => {
    mockSupabase.limit.mockRejectedValue(new Error('Unexpected error'));

    await expect(getAllPostsPaginated(null)).rejects.toThrow(
      'Unexpected error',
    );
    expect(console.error).toHaveBeenCalledWith(
      'getAllPostsPaginated error:',
      expect.any(Error),
    );
  });
});
