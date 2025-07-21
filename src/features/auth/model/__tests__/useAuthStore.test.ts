import { act } from '@testing-library/react';

import { User } from '@/entities/user';
import { createClient } from '@/shared/api/supabase/client';
import { createClient as createClientServer } from '@/shared/api/supabase/server';

import * as authApi from '../../api';
import { buildUserFromAuth } from '../../lib';
import { RegisterCredentials } from '../auth.types';
import { useAuthStore } from '../useAuthStore';

jest.mock('../../api');
jest.mock('@/shared/api/supabase/client');
jest.mock('@/shared/api/supabase/server');
jest.mock('../../lib');

describe('useAuthStore: ', () => {
  const mockAuthUser = { id: '1', email: 'test@example.com' };
  const mockProfile = { name: 'Test User' };
  const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuth: false,
      error: null,
      isLoadingInitialize: false,
      isLoadingLogin: false,
      isLoadingGoogle: false,
      isLoadingSignUp: false,
      isLoadingLogout: false,
    });

    jest.clearAllMocks();
  });

  it('loginWithPassword sets user and isAuth=true on success', async () => {
    (authApi.loginWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockAuthUser },
    });

    (createClient as jest.Mock).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: mockProfile }),
          }),
        }),
      }),
    });

    (buildUserFromAuth as jest.Mock).mockReturnValue(mockUser);

    await act(async () => {
      await useAuthStore.getState().loginWithPassword({
        email: 'test@example.com',
        password: '123456',
      });
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoadingLogin).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loginWithPassword sets error on failure', async () => {
    (authApi.loginWithPassword as jest.Mock).mockRejectedValue(
      new Error('Invalid login credentials'),
    );

    await expect(
      useAuthStore.getState().loginWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpass',
      }),
    ).rejects.toThrow('Invalid email or password');

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.error).toBe('Invalid email or password');
    expect(state.isLoadingLogin).toBe(false);
  });

  it('initialize sets user if session exists', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: () =>
          Promise.resolve({ data: { user: mockAuthUser }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: mockProfile }),
          }),
        }),
      }),
    });

    (buildUserFromAuth as jest.Mock).mockReturnValue(mockUser);

    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoadingInitialize).toBe(false);
  });

  it('initialize sets error if profile fetch fails', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: () =>
          Promise.resolve({ data: { user: mockAuthUser }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () =>
              Promise.resolve({ error: new Error('Profile error') }),
          }),
        }),
      }),
    });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    consoleErrorSpy.mockRestore();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.error).toBe('Profile error');
    expect(state.isLoadingInitialize).toBe(false);
  });

  it('loginWithGoogle sets loading and handles error', async () => {
    (authApi.signInWithGoogle as jest.Mock).mockRejectedValue(
      new Error('Google error'),
    );

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: jest.fn().mockRejectedValue(new Error('Google error')),
      },
    });

    await expect(useAuthStore.getState().loginWithGoogle()).rejects.toThrow(
      'Google error',
    );

    const state = useAuthStore.getState();
    expect(state.isLoadingGoogle).toBe(false);
    expect(state.error).toBe('Google error');
  });

  it('signUpWithPassword sets user and isAuth=true on success', async () => {
    (authApi.signUpWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockAuthUser },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ exists: false }),
      }),
    ) as jest.Mock;

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: mockProfile }),
          }),
        }),
      }),
    });

    (buildUserFromAuth as jest.Mock).mockReturnValue(mockUser);

    await act(async () => {
      await useAuthStore.getState().signUpWithPassword({
        email: 'test@example.com',
        password: '123456',
      } as RegisterCredentials);
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoadingSignUp).toBe(false);
  });

  it('signUpWithPassword sets error on failure', async () => {
    (authApi.signUpWithPassword as jest.Mock).mockRejectedValue(
      new Error('Sign up error'),
    );

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Sign up error'),
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: mockProfile }),
          }),
        }),
      }),
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ exists: false }),
      }),
    ) as jest.Mock;

    await expect(
      useAuthStore.getState().signUpWithPassword({
        email: 'error@example.com',
        password: '123',
      } as RegisterCredentials),
    ).rejects.toThrow('Sign up error');

    const state = useAuthStore.getState();
    expect(state.error).toBe('Sign up error');
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.isLoadingSignUp).toBe(false);
  });

  it('logout clears user and isAuth', async () => {
    (authApi.logout as jest.Mock).mockResolvedValue(undefined);

    (createClientServer as jest.Mock).mockReturnValue({
      auth: {
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    });

    useAuthStore.setState({
      user: mockUser as User,
      isAuth: true,
    });

    await act(async () => {
      await useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.isLoadingLogout).toBe(false);
  });

  it('logout throw an error', async () => {
    (authApi.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (createClientServer as jest.Mock).mockReturnValue({
      auth: {
        signOut: jest
          .fn()
          .mockResolvedValue({ error: new Error('Logout failed') }),
      },
    });

    useAuthStore.setState({
      user: mockUser as User,
      isAuth: true,
    });

    await expect(useAuthStore.getState().logout()).rejects.toThrow(
      'Logout failed',
    );

    const state = useAuthStore.getState();
    expect(state.user).toBe(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoadingLogout).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('updateCurrentUser updates user in store', () => {
    const updatedUser = { id: '1', email: 'new@example.com', name: 'New Name' };
    useAuthStore.getState().updateCurrentUser(updatedUser as User);

    expect(useAuthStore.getState().user).toEqual(updatedUser);
  });

  it('initialize skips if refresh_token_not_found error is thrown', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: null },
            error: { message: 'refresh_token_not_found' },
          }),
      },
    });

    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(state.isLoadingInitialize).toBe(false);
    expect(state.user).toBeNull();
  });

  it('initialize does nothing if no user is returned', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    });

    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });

  it('updateCurrentUser updates user', () => {
    useAuthStore.getState().updateCurrentUser(mockUser as User);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
  });

  it('signUpWithPassword sets error if profile fetch fails', async () => {
    (authApi.signUpWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockAuthUser },
    });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Profile error'),
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () =>
              Promise.resolve({ error: new Error('Profile error') }),
          }),
        }),
      }),
    });

    await expect(
      useAuthStore.getState().signUpWithPassword({
        email: 'test@example.com',
        password: '123456',
      } as RegisterCredentials),
    ).rejects.toThrow('Profile error');

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });
});
