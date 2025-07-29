import { Post } from '@/entities/post';
import { createClient } from '@/shared/api/supabase/server';

import { searchPosts } from '../searchPosts';

jest.mock('@/shared/api/supabase/server');

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: [], error: null }),
};

describe('searchPosts', () => {
  const mockCreateClient = createClient as jest.Mock;

  beforeEach(() => {
    mockCreateClient.mockResolvedValue(mockSupabaseClient);
    jest.clearAllMocks();
  });

  it('returns empty array for empty search term', async () => {
    const result = await searchPosts('');
    expect(result).toEqual([]);
  });

  it('returns empty array for whitespace search term', async () => {
    const result = await searchPosts('   ');
    expect(result).toEqual([]);
  });

  it('searches posts successfully', async () => {
    const mockData = [
      { id: 1, content: 'test post', author_name: 'John' },
      { id: 2, content: 'another post', author_name: 'Jane' },
    ];

    mockSupabaseClient.limit.mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await searchPosts('test');

    expect(mockSupabaseClient.from).toHaveBeenCalledWith(
      'post_with_author_and_likes',
    );
    expect(mockSupabaseClient.select).toHaveBeenCalledWith(
      `
      id,
      content,
      created_at,
      author_name,
      author_avatar,
      image_urls,
      is_deleted,
      is_liked,
      likes_count
    `,
    );
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('is_deleted', false);
    expect(mockSupabaseClient.or).toHaveBeenCalledWith(
      'content.ilike.%test%,author_name.ilike.%test%',
    );
    expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
    expect(mockSupabaseClient.limit).toHaveBeenCalledWith(10);
    expect(result).toEqual(mockData);
  });

  it('throws error on supabase error', async () => {
    mockSupabaseClient.limit.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    await expect(searchPosts('test')).rejects.toThrow('Failed search posts');
  });

  it('handles special characters in search term', async () => {
    const mockData: Post[] = [];
    mockSupabaseClient.limit.mockResolvedValue({
      data: mockData,
      error: null,
    });

    await searchPosts('test@#$%');

    expect(mockSupabaseClient.or).toHaveBeenCalledWith(
      'content.ilike.%test@#$%%,author_name.ilike.%test@#$%%',
    );
  });
});
