import { fireEvent, renderHook } from '@testing-library/react';

import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  it('calls handler on outside click', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const { result } = renderHook(() =>
      useClickOutside({ handleOnClickOutside: handler }),
    );

    if (result.current.current === null) {
      result.current.current = element;
    }

    fireEvent.mouseDown(document.body);
    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('does not call handler on inside click', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const { result } = renderHook(() =>
      useClickOutside({ handleOnClickOutside: handler }),
    );

    if (result.current.current === null) {
      result.current.current = element;
    }

    fireEvent.mouseDown(element);
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('handles touch events', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const { result } = renderHook(() =>
      useClickOutside({ handleOnClickOutside: handler }),
    );

    if (result.current.current === null) {
      result.current.current = element;
    }

    fireEvent.touchStart(document.body);
    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });
});
