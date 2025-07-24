import { createClient } from '@/shared/api/supabase/server';

import {
  changePasswordWithEmailAction,
  changePasswordWithGoogleAction,
} from '../changePasswordAction';
import { checkCurrentPasswordAction } from '../checkCurrentPasswordAction';

jest.mock('@/shared/api/supabase/server');
jest.mock('../checkCurrentPasswordAction');

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;
const mockCheckCurrentPassword =
  checkCurrentPasswordAction as jest.MockedFunction<
    typeof checkCurrentPasswordAction
  >;

describe('changePasswordAction', () => {
  const mockSupabase = {
    auth: {
      updateUser: jest.fn(),
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as never);
  });

  describe('changePasswordWithEmailAction', () => {
    it('returns error when passwords are the same', async () => {
      const result = await changePasswordWithEmailAction(
        'password',
        'password',
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'New password must be different from current password',
      );
    });

    it('returns error when current password is incorrect', async () => {
      mockCheckCurrentPassword.mockResolvedValue(false);

      const result = await changePasswordWithEmailAction('wrong', 'new');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Current password is incorrect');
    });

    it('successfully changes password', async () => {
      mockCheckCurrentPassword.mockResolvedValue(true);
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await changePasswordWithEmailAction('current', 'new');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password successfully changed!');
    });

    it('handles supabase error', async () => {
      mockCheckCurrentPassword.mockResolvedValue(true);
      mockSupabase.auth.updateUser.mockResolvedValue({
        error: { message: 'Auth error' },
      });

      const result = await changePasswordWithEmailAction('current', 'new');

      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordWithGoogleAction', () => {
    it('returns error when user not found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await changePasswordWithGoogleAction('password');

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    });

    it('successfully sets password', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
      });
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await changePasswordWithGoogleAction('password');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Password successfully set!');
    });
  });
});
