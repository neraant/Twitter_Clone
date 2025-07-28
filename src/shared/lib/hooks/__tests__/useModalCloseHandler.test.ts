import { act, renderHook } from '@testing-library/react';

import { useModal } from '../useModal';

jest.useFakeTimers();

describe('useModal', () => {
  it('should set isClosing true and call onClose after delay when handleClose is called', () => {
    const onClose = jest.fn();

    const { result } = renderHook(() => useModal({ onClose, delay: 100 }));

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isClosing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when click outside happens', () => {
    const onClose = jest.fn();

    const { result } = renderHook(() => useModal({ onClose }));

    const outsideNode = document.createElement('div');

    if (result.current.ref.current === null) {
      result.current.ref.current = document.createElement('div');
      document.body.appendChild(result.current.ref.current);
    }

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0,
      });

      Object.defineProperty(event, 'target', {
        value: outsideNode,
        configurable: true,
      });

      document.dispatchEvent(event);
    });

    expect(result.current.isClosing).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(onClose).toHaveBeenCalled();
  });
});
