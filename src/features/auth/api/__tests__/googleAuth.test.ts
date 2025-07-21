import { createClient } from '@/shared/api/supabase/client';
import { routes } from '@/shared/config/routes';

import { signInWithGoogle } from '../googleAuth';

jest.mock('@/shared/api/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('googleAuth: ', () => {
  beforeAll(() => {
    Object.defineProperty(window.location, 'location', {
      configurable: true,
      get: () => 'http://localhost',
    });
  });

  it('should call supabase auth signInWithOAuth with correct params', async () => {
    const mockSignInWithOAuth = jest.fn().mockResolvedValue({});

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    });

    await signInWithGoogle();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `http://localhost${routes.api.callback}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  });
});
