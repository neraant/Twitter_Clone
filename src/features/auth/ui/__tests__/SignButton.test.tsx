import { render, screen } from '@testing-library/react';

import { SignButton } from '../SignButton';

jest.mock('@/shared/ui/button/Button', () => ({
  Button: ({ type, disabled, ariaLabel, children }: never) => (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid='button'
    >
      {children}
    </button>
  ),
}));

jest.mock('@/shared/ui/loader', () => ({
  Loader: () => <div role='progressbar' data-testid='loader' />,
}));

describe('SignButton: ', () => {
  it('renders button with label', () => {
    render(<SignButton label='Sign In' />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('has correct type and aria-label', () => {
    render(<SignButton label='Submit' />);

    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'sign');
  });

  it('shows loader when isLoading is true', () => {
    render(<SignButton label='Loading' isLoading />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('does not show loader when isLoading is false', () => {
    render(<SignButton label='Ready' isLoading={false} />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('disables button when isLoading is true', () => {
    render(<SignButton label='Disabled' isLoading />);

    expect(screen.getByTestId('button')).toBeDisabled();
  });

  it('enables button when isLoading is false', () => {
    render(<SignButton label='Enabled' isLoading={false} />);

    expect(screen.getByTestId('button')).not.toBeDisabled();
  });
});
