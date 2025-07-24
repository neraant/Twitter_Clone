import { createClient } from '@/shared/api/supabase/server';

import { checkCurrentPasswordAction } from '../checkCurrentPasswordAction';

jest.mock('@/shared/api/supabase/server', () => ({
  createClient: jest.fn(),
}));

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
  },
};

describe('checkCurrentPasswordAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('returns true for correct password', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
    });
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    const result = await checkCurrentPasswordAction('correct-password');
    expect(result).toBe(true);
  });

  it('returns false for incorrect password', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
    });
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      error: 'Invalid password',
    });

    const result = await checkCurrentPasswordAction('wrong-password');
    expect(result).toBe(false);
  });

  it('returns false if user is null', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await checkCurrentPasswordAction('any-password');
    expect(result).toBe(false);
  });

  it('returns false on unexpected error', async () => {
    (createClient as jest.Mock).mockRejectedValue(
      new Error('Connection failed'),
    );

    const result = await checkCurrentPasswordAction('any-password');
    expect(result).toBe(false);
  });
});
