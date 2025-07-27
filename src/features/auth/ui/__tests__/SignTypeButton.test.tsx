import { fireEvent, render, screen } from '@testing-library/react';

import { SignTypeButton } from '../SignTypeButton';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: never) => (
    <a href={href} className={className} data-testid='link'>
      {children}
    </a>
  ),
}));

describe('SignTypeButton: ', () => {
  it('renders button with label', () => {
    render(<SignTypeButton label='Test Label' />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders link when href is provided and not disabled', () => {
    render(<SignTypeButton label='Link Label' href='/test' />);

    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/test');
    expect(screen.getByText('Link Label')).toBeInTheDocument();
  });

  it('renders button when href is provided but disabled', () => {
    render(<SignTypeButton label='Disabled Label' href='/test' disabled />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByTestId('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<SignTypeButton label='Click Me' onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders children when provided', () => {
    render(
      <SignTypeButton label='With Child'>
        <span>Child Element</span>
      </SignTypeButton>,
    );

    expect(screen.getByText('Child Element')).toBeInTheDocument();
    expect(screen.getByText('With Child')).toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    render(<SignTypeButton label='Disabled' disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('has correct aria-label', () => {
    render(<SignTypeButton label='sign' />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'sign');
  });
});
