import { act, renderHook } from '@testing-library/react';

import { searchUsers } from '@/entities/user/api/searchUsers';
import { searchPosts } from '@/features/search-posts/api/searchPosts';

import { searchType } from '../exploreClient.type';
import { useExploreSearch } from '../useExploreSearch';

jest.mock('@/entities/user/api/searchUsers');
jest.mock('@/features/search-posts/api/searchPosts');

describe('useExploreSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears data for empty query', async () => {
    const { result } = renderHook(() => useExploreSearch());

    await act(async () => {
      await result.current.search(searchType.posts, '');
    });

    expect(result.current.posts).toEqual([]);
    expect(result.current.users).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
  });

  it('searches posts successfully', async () => {
    const posts = [{ id: '1', title: 'Post' }];
    (searchPosts as jest.Mock).mockResolvedValue(posts);

    const { result } = renderHook(() => useExploreSearch());

    await act(async () => {
      await result.current.search(searchType.posts, 'test');
    });

    expect(result.current.posts).toEqual(posts);
    expect(result.current.hasSearched).toBe(true);
  });

  it('searches users successfully', async () => {
    const users = [{ id: '1', name: 'User' }];
    (searchUsers as jest.Mock).mockResolvedValue(users);

    const { result } = renderHook(() => useExploreSearch());

    await act(async () => {
      await result.current.search(searchType.users, 'test');
    });

    expect(result.current.users).toEqual(users);
    expect(result.current.hasSearched).toBe(true);
  });

  it('handles search error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (searchPosts as jest.Mock).mockRejectedValue(new Error('Search failed'));

    const { result } = renderHook(() => useExploreSearch());

    await act(async () => {
      await result.current.search(searchType.posts, 'test');
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });
});
