import { logout } from '../logout';

jest.mock('@/shared/api/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/shared/api/supabase/server';

describe('logout: ', () => {
  it('should call createClient and signOut', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });

    await logout();

    expect(createClient).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should thorow an error with signOut', async () => {
    const mockSignOut = jest
      .fn()
      .mockResolvedValue({ error: new Error('Logout failed') });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });

    await expect(logout()).rejects.toThrow('Logout failed');
  });
});
