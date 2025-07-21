import { User } from '@supabase/supabase-js';

import { buildUserFromAuth } from '../buildUserFromAuth.utils';

describe('buildUserFromAuth.utils: ', () => {
  it('Should build user correctly', () => {
    const authUser: User = {
      id: '123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '',
    };

    const profile = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.webp',
      banner_url: 'https://example.com/banner.webp',
      phone_number: '+123456789',
      date_of_birth: '2000-01-01',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      followers_count: 10,
      following_count: 5,
      user_telegram: '@testuser',
      bio: 'Test bio',
      gender: 'male',
    };

    const user = buildUserFromAuth(authUser, profile);

    expect(user).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.webp',
      banner_url: 'https://example.com/banner.webp',
      phone_number: '+123456789',
      date_of_birth: '2000-01-01',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      followers_count: 10,
      following_count: 5,
      user_telegram: '@testuser',
      bio: 'Test bio',
      gender: 'male',
    });
  });

  it('Should build user correctly with null profile (fallback to authUser)', () => {
    const authUser: User = {
      id: '456',
      email: 'fallback@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '',
    };

    const user = buildUserFromAuth(authUser, null);

    expect(user).toMatchObject({
      id: '456',
      email: 'fallback@example.com',
      name: 'fallback@example.com',
      avatar_url: null,
      banner_url: null,
      phone_number: null,
      date_of_birth: null,
      updated_at: null,
      followers_count: 0,
      following_count: 0,
      user_telegram: null,
      bio: null,
      gender: '',
    });

    expect(new Date(user.created_at).toString()).not.toBe('Invalid Date');
  });
});
