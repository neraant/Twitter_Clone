import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useModalCloseHandler } from '../useModalCloseHandler';

describe('useModalCloseHandler', () => {
  it('closes modal after delay', () => {
    const onClose = jest.fn();
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useModalCloseHandler(ref, onClose, 100),
    );

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isClosing).toBe(true);

    setTimeout(() => {
      expect(onClose).toHaveBeenCalled();
    }, 100);
  });

  it('closes on outside click', () => {
    const onClose = jest.fn();
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() => useModalCloseHandler(ref, onClose));

    act(() => {
      result.current.handleClickOutside({
        target: document.createElement('div'),
      } as never);
    });

    expect(result.current.isClosing).toBe(true);
  });
});
