import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { act } from 'react';

import { useAuthStore } from '@/features/auth/model';
import { useToast } from '@/shared/lib/toast';

import { useLogout } from '../useLogout';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/features/auth/model', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/shared/lib/toast', () => ({
  useToast: jest.fn(),
}));

describe('useLogout', () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockPush });
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockLogout);
    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  it('successful logout', async () => {
    mockLogout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      'Succes',
      'Logout success!',
      'success',
    );
  });

  it('failed logout', async () => {
    mockLogout.mockRejectedValue(new Error('Logout failed'));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      'Error',
      'Logout failure!',
      'error',
    );
  });
});
