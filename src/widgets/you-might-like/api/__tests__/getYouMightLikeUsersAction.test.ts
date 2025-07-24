import { createClient } from '@/shared/api/supabase/server';

import { getYouMightLikeUsersAction } from '../getYouMightLikeUsersAction';

jest.mock('@/shared/api/supabase/server');

const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockNeq = jest.fn();
const mockNot = jest.fn();

describe('getYouMightLikeUsersAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockNeq.mockReturnThis();
    mockNot.mockReturnThis();

    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn(() => ({
        select: mockSelect,
        eq: mockEq,
        neq: mockNeq,
        not: mockNot,
      })),
    });
  });

  it('returns empty array when fetching follows fails', async () => {
    mockEq.mockResolvedValueOnce({ data: null, error: 'follows error' });

    const result = await getYouMightLikeUsersAction('user1');
    expect(result).toEqual([]);
  });

  it('returns empty array when fetching users fails', async () => {
    mockEq.mockResolvedValueOnce({
      data: [{ following_id: 'user2' }],
      error: null,
    });
    mockNot.mockResolvedValueOnce({ data: null, error: 'users error' });

    const result = await getYouMightLikeUsersAction('user1');
    expect(result).toEqual([]);
  });

  it('returns empty array on unexpected error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (createClient as jest.Mock).mockImplementationOnce(() => {
      throw new Error('fail');
    });

    const result = await getYouMightLikeUsersAction('user1');
    expect(result).toEqual([]);

    (console.error as jest.Mock).mockRestore();
  });
});
