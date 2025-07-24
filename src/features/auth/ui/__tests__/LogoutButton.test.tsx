import { fireEvent, render, screen } from '@testing-library/react';

import { useLockBodyScroll, useLogout } from '@/shared/lib/hooks';

import { LogoutButton } from '../LogoutButton';

jest.mock('@/shared/ui/confirm-modal', () => ({
  ConfirmModal: ({
    title,
    description,
    actionButtonLabel,
    onClose,
    onConfirm,
    isLoading,
  }: never) => (
    <div data-testid='confirm-modal'>
      <h6>{title}</h6>
      <p>{description}</p>
      <button onClick={onClose} data-testid='cancel-button'>
        Cancel
      </button>
      <button onClick={onConfirm} data-testid='confirm-button'>
        {actionButtonLabel}
        {isLoading && <div role='progressbar' data-testid='modal-loader' />}
      </button>
    </div>
  ),
}));

jest.mock('@/shared/ui/loader', () => ({
  Loader: ({ size }: { size?: string }) => (
    <div role='progressbar' data-testid='loader' data-size={size} />
  ),
}));

jest.mock('@/shared/ui/icon', () => ({
  CrossIcon: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid='cross-icon'>
      ×
    </button>
  ),
}));

jest.mock('@/shared/lib/hooks', () => ({
  useLogout: jest.fn(),
  useLockBodyScroll: jest.fn(),
  useModalCloseHandler: jest.fn(() => ({
    isClosing: false,
    handleClose: jest.fn(),
  })),
}));

describe('LogoutButton: ', () => {
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogout as jest.Mock).mockReturnValue({
      isLoading: false,
      handleLogout: mockHandleLogout,
    });
    (useLockBodyScroll as jest.Mock).mockImplementation(() => {});
  });

  it('renders the button with logout text and children', () => {
    render(<LogoutButton>Child</LogoutButton>);

    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('opens modal on button click', () => {
    render(<LogoutButton>Test Child</LogoutButton>);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(screen.getByText('Confirm logout')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you wanna logout?'),
    ).toBeInTheDocument();
  });

  it('calls handleLogout when confirm button is clicked', () => {
    (useLogout as jest.Mock).mockReturnValue({
      isLoading: false,
      handleLogout: mockHandleLogout,
    });

    render(<LogoutButton>Child</LogoutButton>);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('disables button and shows loader when loading', () => {
    (useLogout as jest.Mock).mockReturnValue({
      isLoading: true,
      handleLogout: mockHandleLogout,
    });

    render(<LogoutButton>Child</LogoutButton>);

    const button = screen.getByTestId('logout-button');
    expect(button).toBeDisabled();
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    render(<LogoutButton>Child</LogoutButton>);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-logout-button';
    render(<LogoutButton className={customClass}>Child</LogoutButton>);

    const button = screen.getByTestId('logout-button');
    expect(button).toHaveClass(customClass);
  });
});
