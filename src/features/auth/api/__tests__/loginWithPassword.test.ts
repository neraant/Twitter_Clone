import { loginWithPassword } from '../loginWithPassword';

jest.mock('@/shared/api/supabase/client', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/shared/api/supabase/client';

describe('SignIn: ', () => {
  it('should send login request with valid credentials', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });

    const credentials = {
      email: 'test@example.com',
      password: 'passwordtest123',
    };

    const result = await loginWithPassword(credentials);

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'passwordtest123',
    });

    expect(result).toEqual({
      data: { user: { id: '123', email: 'test@example.com' } },
    });
  });

  it('should throw error for invalid credentials', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Invalid credentials'),
    });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });

    const credentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    await expect(loginWithPassword(credentials)).rejects.toThrow(
      'Invalid credentials',
    );

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });
  });
});
