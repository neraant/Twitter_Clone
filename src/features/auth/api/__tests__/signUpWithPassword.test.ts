import { checkEmailExists, signUpWithPassword } from '../signUpWithPassword';

jest.mock('@/shared/api/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('../signUpWithPassword', () => ({
  ...jest.requireActual('../signUpWithPassword'),
  checkEmailExists: jest.fn(),
}));

jest.mock('@/shared/config/routes', () => ({
  routes: {
    api: {
      checkEmail: 'http://localhost/api/check-email',
    },
  },
}));

import { createClient } from '@/shared/api/supabase/client';

describe('SignUp: ', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  const credentials = {
    email: 'test@example.com',
    password: 'passwordtest123',
    name: 'testname',
    phoneNumber: '+123121212123',
    dateOfBirth: '1990-01-01',
  };

  it('should send registration request with valid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ exists: false }),
    });

    (checkEmailExists as jest.Mock).mockReturnValue(false);

    const mockSignUp = jest.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    });

    const result = await signUpWithPassword(credentials);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          phone_number: credentials.phoneNumber,
          date_of_birth: credentials.dateOfBirth,
        },
      },
    });

    expect(result).toEqual({
      data: { user: { id: '123', email: credentials.email } },
    });
  });

  it('should throw error for existing user (from checkemail)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ exists: true }),
    });

    (checkEmailExists as jest.Mock).mockResolvedValue(true);

    await expect(signUpWithPassword(credentials)).rejects.toThrow(
      'Email is already registered',
    );
  });

  it('should throw error for existing user (from supabase)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ exists: false }),
    });

    (checkEmailExists as jest.Mock).mockResolvedValue(false);

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Supabase error: Email is already registered'),
        }),
      },
    });

    await expect(signUpWithPassword(credentials)).rejects.toThrow(
      'Supabase error: Email is already registered',
    );
  });
});
