import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { DEBOUNCE_MS } from '../searchPosts.constants';
import { usePostsDebounce } from '../usePostsDebounce';

describe('usePostsDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls fetch after debounce delay', async () => {
    const mockFetch = jest.fn();
    const mockSetLoading = jest.fn();

    renderHook(() =>
      usePostsDebounce({
        fetch: mockFetch,
        value: 'test',
        setLoading: mockSetLoading,
      }),
    );

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockFetch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(mockFetch).toHaveBeenCalledWith('test');
  });

  it('does not call fetch for empty value', () => {
    const mockFetch = jest.fn();
    const mockSetLoading = jest.fn();

    renderHook(() =>
      usePostsDebounce({
        fetch: mockFetch,
        value: '',
        setLoading: mockSetLoading,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSetLoading).not.toHaveBeenCalled();
  });

  it('does not call fetch for whitespace value', () => {
    const mockFetch = jest.fn();
    const mockSetLoading = jest.fn();

    renderHook(() =>
      usePostsDebounce({
        fetch: mockFetch,
        value: '   ',
        setLoading: mockSetLoading,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSetLoading).not.toHaveBeenCalled();
  });

  it('cancels previous timeout on value change', () => {
    const mockFetch = jest.fn();
    const mockSetLoading = jest.fn();

    const { rerender } = renderHook(
      ({ value }) =>
        usePostsDebounce({
          fetch: mockFetch,
          value,
          setLoading: mockSetLoading,
        }),
      { initialProps: { value: 'test1' } },
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'test2' });

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('test2');
  });

  it('works without setLoading callback', () => {
    const mockFetch = jest.fn();

    renderHook(() =>
      usePostsDebounce({
        fetch: mockFetch,
        value: 'test',
      }),
    );

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(mockFetch).toHaveBeenCalledWith('test');
  });

  it('cleans up timeout on unmount', () => {
    const mockFetch = jest.fn();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() =>
      usePostsDebounce({
        fetch: mockFetch,
        value: 'test',
      }),
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
