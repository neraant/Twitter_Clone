import { revalidateTag } from 'next/cache';

import { createClient } from '@/shared/api/supabase/server';

import {
  followUserAction,
  isFollowingAction,
  unfollowUserAction,
} from '../followActions';

jest.mock('@/shared/api/supabase/server');
jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));

const mockCreateClient = createClient as jest.Mock;
const mockRevalidateTag = revalidateTag as jest.Mock;

const mockQueryBuilder = {
  upsert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
};

describe('followActions', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => mockQueryBuilder),
    rpc: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase);
  });

  describe('followUserAction', () => {
    it('returns unauthorized if user mismatch', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'wrong-id' } },
        error: null,
      });

      const res = await followUserAction('target-id', 'current-id');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Unauthorized');
    });

    it('successfully follows a user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'current-id' } },
        error: null,
      });
      mockQueryBuilder.upsert.mockResolvedValue({ error: null });
      mockSupabase.rpc.mockResolvedValue({ error: null });

      const res = await followUserAction('target-id', 'current-id');

      expect(res.success).toBe(true);
      expect(mockRevalidateTag).toHaveBeenCalledWith('user-target-id');
    });

    it('returns error if upsert fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'current-id' } },
        error: null,
      });
      mockQueryBuilder.upsert.mockResolvedValue({
        error: { message: 'Upsert failed' },
      });

      const res = await followUserAction('target-id', 'current-id');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Upsert failed');
    });
  });

  describe('unfollowUserAction', () => {
    it('returns unauthorized if user mismatch', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'wrong-id' } },
        error: null,
      });

      const res = await unfollowUserAction('target-id', 'current-id');

      expect(res.success).toBe(false);
      expect(res.error).toBe('Unauthorized');
    });
  });

  describe('isFollowingAction', () => {
    it('returns true if following', async () => {
      mockQueryBuilder.maybeSingle.mockResolvedValue({
        data: { id: '123' },
        error: null,
      });

      const res = await isFollowingAction('target-id', 'current-id');

      expect(res).toBe(true);
    });

    it('returns false if not following', async () => {
      mockQueryBuilder.maybeSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      const res = await isFollowingAction('target-id', 'current-id');

      expect(res).toBe(false);
    });

    it('throws if query fails', async () => {
      mockQueryBuilder.maybeSingle.mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      });

      await expect(
        isFollowingAction('target-id', 'current-id'),
      ).rejects.toThrow('Query failed');
    });
  });
});
