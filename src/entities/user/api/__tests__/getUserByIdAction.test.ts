import { cookies, headers } from 'next/headers';

import { getUserByIdAction } from '../getUserByIdAction';

jest.mock('next/headers');
global.fetch = jest.fn();

describe('getUserByIdAction', () => {
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

  it('returns user when found', async () => {
    const user = { id: '1', name: 'John' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user }),
    });

    const result = await getUserByIdAction('1');
    expect(result).toEqual(user);
  });

  it('returns null when response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const result = await getUserByIdAction('1');
    expect(result).toBeNull();
  });
});
