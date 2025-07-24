import { renderHook } from '@testing-library/react';

import { useLockBodyScroll } from '../useLockBodyScroll';

describe('useLockBodyScroll', () => {
  it('adds no-scroll class when open', () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.classList.contains('no-scroll')).toBe(true);
  });

  it('removes no-scroll class when closed', () => {
    const { rerender } = renderHook(({ isOpen }) => useLockBodyScroll(isOpen), {
      initialProps: { isOpen: true },
    });

    rerender({ isOpen: false });
    expect(document.body.classList.contains('no-scroll')).toBe(false);
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    unmount();
    expect(document.body.classList.contains('no-scroll')).toBe(false);
  });
});
