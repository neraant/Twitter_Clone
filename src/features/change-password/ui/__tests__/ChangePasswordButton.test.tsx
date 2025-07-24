import { render, screen } from '@testing-library/react';

import { CHANGE_BUTTON_TEXT } from '../../lib/changePasswordButton.constants';
import { ChangePasswordButton } from '../ChangePasswordButton';

jest.mock('@/shared/ui/loader', () => ({
  Loader: () => <div data-testid='loader'>Loading...</div>,
}));

describe('ChangePasswordButton', () => {
  it('renders button with correct text', () => {
    render(<ChangePasswordButton isLoading={false} />);
    expect(
      screen.getByRole('button', { name: /change password/i }),
    ).toHaveTextContent(CHANGE_BUTTON_TEXT);
  });

  it('disables button and shows loader when isLoading is true', () => {
    render(<ChangePasswordButton isLoading={true} />);
    const button = screen.getByRole('button', { name: /change password/i });

    expect(button).toBeDisabled();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('enables button and hides loader when isLoading is false', () => {
    render(<ChangePasswordButton isLoading={false} />);
    const button = screen.getByRole('button', { name: /change password/i });

    expect(button).toBeEnabled();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });
});
