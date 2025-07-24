import { cookies, headers } from 'next/headers';

import { getCurrentUserAction } from '../getCurrentUserAction';

jest.mock('next/headers');
global.fetch = jest.fn();

describe('getCurrentUserAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue({
      toString: () => 'cookie=value',
    });
    (headers as jest.Mock).mockResolvedValue(
      new Map([
        ['host', 'localhost:3000'],
        ['x-forwarded-proto', 'https'],
      ]),
    );
  });

  it('returns user when response is ok', async () => {
    const user = { id: '1', name: 'John' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user }),
    });

    const result = await getCurrentUserAction();
    expect(result).toEqual(user);
  });

  it('returns null when response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const result = await getCurrentUserAction();
    expect(result).toBeNull();
  });

  it('returns null when user is null', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: null }),
    });

    const result = await getCurrentUserAction();
    expect(result).toBeNull();
  });
});
