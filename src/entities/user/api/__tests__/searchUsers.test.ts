import { createClient } from '@/shared/api/supabase/server';

import { searchUsers } from '../searchUsers';

jest.mock('@/shared/api/supabase/server');

describe('searchUsers', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('returns empty array for empty search term', async () => {
    const result = await searchUsers('');
    expect(result).toEqual([]);
  });

  it('returns users when search successful', async () => {
    const users = [{ id: '1', name: 'John' }];
    mockSupabase.limit.mockResolvedValue({ data: users, error: null });

    const result = await searchUsers('john');
    expect(result).toEqual(users);
  });

  it('throws error when search fails', async () => {
    mockSupabase.limit.mockResolvedValue({
      data: null,
      error: { message: 'Error' },
    });

    await expect(searchUsers('john')).rejects.toThrow('Failed search users');
  });
});
