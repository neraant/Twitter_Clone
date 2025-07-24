import { act, renderHook } from '@testing-library/react';

import { usePhoneInput } from '../usePhoneInput';

describe('usePhoneInput', () => {
  it('formats phone number correctly for full number', () => {
    const { result } = renderHook(() => usePhoneInput(''));

    act(() => {
      result.current.handlePhoneChange({
        target: { value: '+37529123456' },
      } as never);
    });

    expect(result.current.displayValue).toBe('+375(29)-123-45-6');
  });

  it('formats shorter number correctly', () => {
    const { result } = renderHook(() => usePhoneInput(''));

    act(() => {
      result.current.handlePhoneChange({
        target: { value: '+37529' },
      } as never);
    });

    expect(result.current.displayValue).toBe('+375(29');
  });

  it('prevents deletion of prefix on Backspace', () => {
    const { result } = renderHook(() => usePhoneInput('+375'));
    const preventDefault = jest.fn();

    act(() => {
      result.current.handlePhoneKeyDown({
        key: 'Backspace',
        target: { selectionStart: 2 },
        preventDefault,
      } as never);
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('prevents deletion of prefix on Delete', () => {
    const { result } = renderHook(() => usePhoneInput('+375'));
    const preventDefault = jest.fn();

    act(() => {
      result.current.handlePhoneKeyDown({
        key: 'Delete',
        target: { selectionStart: 2 },
        preventDefault,
      } as never);
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('calls onChange with formatted value', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => usePhoneInput('', onChange));

    act(() => {
      result.current.handlePhoneChange({
        target: { value: '+37529123456' },
      } as never);
    });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].target.value).toBe('+375(29)-123-45-6');
  });

  it('sets prefix on focus when displayValue is empty', () => {
    const onChange = jest.fn();
    const setSelectionRange = jest.fn();

    const { result } = renderHook(() => usePhoneInput('', onChange));

    act(() => {
      result.current.handlePhoneFocus({
        target: { setSelectionRange },
      } as never);
    });

    expect(result.current.displayValue).toBe('+375');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls setSelectionRange if cursor before prefix length on focus', () => {
    jest.useFakeTimers();

    const setSelectionRange = jest.fn();
    const { result } = renderHook(() => usePhoneInput('+375'));

    act(() => {
      result.current.handlePhoneFocus({
        target: { setSelectionRange, selectionStart: 1 },
      } as never);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(setSelectionRange).toHaveBeenCalledWith(4, 4);

    jest.useRealTimers();
  });

  it('updates displayValue when externalValue changes', () => {
    const { result, rerender } = renderHook(({ val }) => usePhoneInput(val), {
      initialProps: { val: '' },
    });

    expect(result.current.displayValue).toBe('');

    rerender({ val: '+37529123456' });

    expect(result.current.displayValue).toBe('+37529123456');
  });
});
