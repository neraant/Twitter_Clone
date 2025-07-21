import { createBrowserClient } from '@supabase/ssr';

import { createClient } from '../client';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('createClient (browser)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'test_url';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
  });

  it('calls createBrowserClient with env variables', () => {
    (createBrowserClient as jest.Mock).mockReturnValue('mocked_client');

    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith('test_url', 'test_key');
    expect(client).toBe('mocked_client');
  });
});
