import { cookies } from 'next/headers';

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { createServerClient } from '@supabase/ssr';

import { createClient } from '../server';

describe('createClient (server)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'test_url';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
  });

  it('calls createServerClient with cookies and env variables', async () => {
    const mockCookieStore = {
      getAll: jest
        .fn()
        .mockReturnValue([{ name: 'token', value: 'abc', options: {} }]),
      set: jest.fn(),
    };

    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    (createServerClient as jest.Mock).mockReturnValue('mocked_server_client');

    const client = await createClient();

    expect(cookies).toHaveBeenCalled();
    expect(createServerClient).toHaveBeenCalledWith(
      'test_url',
      'test_key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );

    expect(client).toBe('mocked_server_client');

    expect(
      (createServerClient as jest.Mock).mock.calls[0][2].cookies.getAll(),
    ).toEqual(mockCookieStore.getAll());

    const setAllFn = (createServerClient as jest.Mock).mock.calls[0][2].cookies
      .setAll;
    setAllFn([{ name: 'test', value: 'val', options: {} }]);
    expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'val', {});
  });
});
