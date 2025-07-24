import { act } from 'react-dom/test-utils';

import { useFollowStore } from '../';

describe('useFollowStore', () => {
  const userId = 'user-123';

  afterEach(() => {
    useFollowStore.setState({ loadingUsers: new Set() });
  });

  it('initially user is not loading', () => {
    const isLoading = useFollowStore.getState().isUserLoading(userId);
    expect(isLoading).toBe(false);
  });

  it('sets user loading to true', () => {
    act(() => {
      useFollowStore.getState().setUserLoading(userId, true);
    });

    const isLoading = useFollowStore.getState().isUserLoading(userId);
    expect(isLoading).toBe(true);
  });

  it('sets user loading to false', () => {
    act(() => {
      useFollowStore.getState().setUserLoading(userId, true);
      useFollowStore.getState().setUserLoading(userId, false);
    });

    const isLoading = useFollowStore.getState().isUserLoading(userId);
    expect(isLoading).toBe(false);
  });
});
