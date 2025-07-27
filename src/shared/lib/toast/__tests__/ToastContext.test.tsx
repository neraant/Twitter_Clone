import { act, render, screen } from '@testing-library/react';

import { ToastProvider, useToastContext } from '../ToastContext';

const TestComponent = () => {
  const { toasts, showToast, removeToast } = useToastContext();

  return (
    <div>
      <button onClick={() => showToast('Test', 'Message', 'success')}>
        Show Toast
      </button>
      <button onClick={() => removeToast(1)}>Remove Toast</button>
      <div data-testid='toasts-count'>{toasts.length}</div>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          {toast.title}: {toast.message}
        </div>
      ))}
    </div>
  );
};

describe('ToastContext', () => {
  it('provides toast functionality', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
  });

  it('adds toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText('Show Toast').click();
    });

    expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');
    expect(screen.getByText('Test: Message')).toBeInTheDocument();
  });

  it('throws error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToastContext must be used within ToastContextProvider');

    consoleSpy.mockRestore();
  });
});
