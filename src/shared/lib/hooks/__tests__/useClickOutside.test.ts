import { fireEvent, renderHook } from '@testing-library/react';

import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  it('calls handler on outside click', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, handler));

    fireEvent.mouseDown(document.body);
    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler on inside click', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    const ref = { current: element };

    renderHook(() => useClickOutside(ref, handler));

    fireEvent.mouseDown(element);
    expect(handler).not.toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, handler));

    fireEvent.touchStart(document.body);
    expect(handler).toHaveBeenCalled();
  });
});
