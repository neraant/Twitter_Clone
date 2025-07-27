import { renderHook } from '@testing-library/react';

import { usePasswordForm } from '../usePasswordForm';

describe('usePasswordForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePasswordForm(true));

    expect(result.current.register).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.setValue).toBeDefined();
    expect(result.current.trigger).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.errors).toEqual({});
  });

  it('should work with email user context', () => {
    const { result } = renderHook(() => usePasswordForm(true));

    expect(result.current.register).toBeDefined();
    expect(result.current.errors).toEqual({});
  });

  it('should work with non-email user context', () => {
    const { result } = renderHook(() => usePasswordForm(false));

    expect(result.current.register).toBeDefined();
    expect(result.current.errors).toEqual({});
  });

  it('should work with null user context', () => {
    const { result } = renderHook(() => usePasswordForm(null));

    expect(result.current.register).toBeDefined();
    expect(result.current.errors).toEqual({});
  });
});
