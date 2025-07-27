import { notFound } from 'next/navigation';

import { createClient } from '@/shared/api/supabase/server';

import { getPost } from '../getPost';

jest.mock('@/shared/api/supabase/server');
jest.mock('next/navigation');

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe('getPost', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
  };

  const mockPost = {
    id: '1',
    content: 'Test post',
    created_at: '2023-01-01T00:00:00Z',
    author_id: 'user-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as never);
  });

  it('should return post when found', async () => {
    mockSupabase.maybeSingle.mockResolvedValue({
      data: mockPost,
      error: null,
    });

    const result = await getPost('post-123');

    expect(mockSupabase.from).toHaveBeenCalledWith(
      'post_with_author_and_likes',
    );
    expect(mockSupabase.select).toHaveBeenCalledWith('*');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'post-123');
    expect(mockSupabase.eq).toHaveBeenCalledWith('is_deleted', false);
    expect(result).toEqual(mockPost);
  });

  it('should call notFound when post is not found', async () => {
    mockSupabase.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    await getPost('non-existent-post');

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should call notFound when error occurs', async () => {
    mockSupabase.maybeSingle.mockResolvedValue({
      data: null,
      error: new Error('Database error'),
    });

    await getPost('post-123');

    expect(mockNotFound).toHaveBeenCalled();
  });
});
