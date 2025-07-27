import { renderHook } from '@testing-library/react';

import { useToast } from '../useToast';

jest.mock('@/shared/lib/toast/ToastContext', () => ({
  ...jest.requireActual('@/shared/lib/toast/ToastContext'),
  useToastContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('useToast', () => {
  it('returns showToast function', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.showToast).toBeDefined();
    expect(typeof result.current.showToast).toBe('function');
  });
});
