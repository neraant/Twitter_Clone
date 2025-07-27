import { hasEmailProvider, hasGoogleProvider } from '../userProvider.utils';

const mockGetUser = jest.fn();

jest.mock('@/shared/api/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe('userProvider.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hasEmailProvider', () => {
    it('should return false when user is null', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(false);
    });

    it('should return false when user has no identities', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: null,
          },
        },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(false);
    });

    it('should return false when user has empty identities array', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [],
          },
        },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(false);
    });

    it('should return false when user has no email provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'google' }, { provider: 'github' }],
          },
        },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(false);
    });

    it('should return true when user has email provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'email' }, { provider: 'google' }],
          },
        },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(true);
    });

    it('should return true when user has only email provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'email' }],
          },
        },
      });

      const result = await hasEmailProvider();

      expect(result).toBe(true);
    });
  });

  describe('hasGoogleProvider', () => {
    it('should return undefined when user is null', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
      });

      const result = await hasGoogleProvider();

      expect(result).toBeUndefined();
    });

    it('should return undefined when user has no identities', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: null,
          },
        },
      });

      const result = await hasGoogleProvider();

      expect(result).toBeUndefined();
    });

    it('should return undefined when user has empty identities array', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [],
          },
        },
      });

      const result = await hasGoogleProvider();

      expect(result).toBeUndefined();
    });

    it('should return undefined when user has no google provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'email' }, { provider: 'github' }],
          },
        },
      });

      const result = await hasGoogleProvider();

      expect(result).toBeUndefined();
    });

    it('should return true when user has google provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'google' }, { provider: 'email' }],
          },
        },
      });

      const result = await hasGoogleProvider();

      expect(result).toBe(true);
    });

    it('should return true when user has only google provider', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            identities: [{ provider: 'google' }],
          },
        },
      });

      const result = await hasGoogleProvider();

      expect(result).toBe(true);
    });
  });
});
