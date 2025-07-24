import { act } from 'react';

import { useSearchPostsStore } from '../useSearchPostsStore';

describe('useSearchPostsStore', () => {
  beforeEach(() => {
    jest.resetModules();

    useSearchPostsStore.setState({
      query: '',
      results: [],
      isLoading: false,
      hasSearched: false,
      error: null,
    });
  });

  it('initializes with correct default state', () => {
    const state = useSearchPostsStore.getState();

    expect(state.query).toBe('');
    expect(state.results).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.hasSearched).toBe(false);
    expect(state.error).toBe(null);
  });

  it('setQuery updates query and resets flags', () => {
    const { setQuery } = useSearchPostsStore.getState();

    act(() => {
      useSearchPostsStore.setState({ hasSearched: true, error: 'some error' });
      setQuery('new query');
    });

    const state = useSearchPostsStore.getState();
    expect(state.query).toBe('new query');
    expect(state.hasSearched).toBe(false);
    expect(state.error).toBe(null);
  });

  it('setLoading updates loading state', () => {
    const { setLoading } = useSearchPostsStore.getState();

    act(() => {
      setLoading(true);
    });

    expect(useSearchPostsStore.getState().isLoading).toBe(true);

    act(() => {
      setLoading(false);
    });

    expect(useSearchPostsStore.getState().isLoading).toBe(false);
  });

  it('search handles successful response', async () => {
    const mockResults = [{ id: 1, content: 'test', author_name: 'John' }];

    jest.doMock('../../api/searchPosts', () => ({
      searchPosts: jest.fn().mockResolvedValue(mockResults),
    }));

    const { useSearchPostsStore } = await import('../useSearchPostsStore');

    useSearchPostsStore.setState({
      query: '',
      results: [],
      isLoading: false,
      hasSearched: false,
      error: null,
    });

    const { search } = useSearchPostsStore.getState();

    await act(async () => {
      await search('test');
    });

    const state = useSearchPostsStore.getState();
    expect(state.results).toEqual(mockResults);
    expect(state.isLoading).toBe(false);
    expect(state.hasSearched).toBe(true);
    expect(state.error).toBe(null);
  });

  it('search handles error response', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    jest.doMock('../../api/searchPosts', () => ({
      searchPosts: jest.fn().mockRejectedValue(new Error('API Error')),
    }));

    const { search } = useSearchPostsStore.getState();

    await act(async () => {
      await search('test');
    });

    const state = useSearchPostsStore.getState();
    expect(state.error).toBe('Something went wrong');
    expect(state.isLoading).toBe(false);
    expect(state.hasSearched).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('search sets loading state during execution', () => {
    jest.doMock('../../api/searchPosts', () => ({
      searchPosts: jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
        ),
    }));

    const { search } = useSearchPostsStore.getState();

    act(() => {
      search('test');
    });

    expect(useSearchPostsStore.getState().isLoading).toBe(true);
    expect(useSearchPostsStore.getState().error).toBe(null);
  });
});
