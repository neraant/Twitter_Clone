import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import * as actions from '../../api/followActions';
import { useFollow } from '../useFollow';

jest.mock('../../model', () => ({
  useFollowStore: jest.fn(() => ({
    setUserLoading: jest.fn(),
    isUserLoading: jest.fn(() => false),
  })),
}));
jest.mock('@/shared/lib/toast', () => ({
  useToast: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));
jest.mock('../../api/followActions');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFollow', () => {
  const targetUserId = 'target-id';
  const currentUserId = 'current-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns isFollowed = true when user is following', async () => {
    (actions.isFollowingAction as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(
      () => useFollow({ targetUserId, currentUserId }),
      { wrapper },
    );

    await waitFor(() => result.current.loading === false);

    expect(result.current.isFollowed).toBe(true);
  });

  it('triggers follow mutation on click', async () => {
    (actions.isFollowingAction as jest.Mock).mockResolvedValue(false);
    (actions.followUserAction as jest.Mock).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(
      () => useFollow({ targetUserId, currentUserId }),
      { wrapper },
    );

    await waitFor(() => result.current.loading === false);

    act(() => {
      result.current.handleClick();
    });
  });

  it('triggers unfollow mutation on click', async () => {
    (actions.isFollowingAction as jest.Mock).mockResolvedValue(true);
    (actions.unfollowUserAction as jest.Mock).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(
      () => useFollow({ targetUserId, currentUserId }),
      { wrapper },
    );

    await waitFor(() => result.current.loading === false);

    act(() => {
      result.current.handleClick();
    });
  });
});
