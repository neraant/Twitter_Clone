import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LoginForm } from '../ui';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockLoginWithPassword = jest.fn();
const mockShowToast = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: never) => (
    <a href={href} className={className} data-testid='signup-link'>
      {children}
    </a>
  ),
}));

jest.mock('@/features/auth', () => ({
  SignButton: ({ label, isLoading }: { label: string; isLoading: boolean }) => (
    <button type='submit' disabled={isLoading} data-testid='sign-button'>
      {label}
      {isLoading && <div data-testid='button-loader' />}
    </button>
  ),
  useAuthStore: (selector: unknown) => {
    const state = {
      loginWithPassword: mockLoginWithPassword,
      isLoadingLogin: false,
    };
    if (typeof selector === 'function') return selector(state);
  },
}));

jest.mock('@/shared/lib/toast/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/shared/ui/icon', () => ({
  TwitterLogoIcon: ({ className, width, height }: never) => (
    <div
      className={className}
      data-testid='twitter-logo'
      style={{ width, height }}
    />
  ),
}));

interface SignInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  error?: boolean;
  isPassword?: boolean;
}
jest.mock('@/shared/ui/sign-input', () => ({
  SignInput: ({ placeholder, error, isPassword, ...props }: SignInputProps) => (
    <input
      {...props}
      placeholder={placeholder}
      type={isPassword ? 'password' : 'text'}
      data-testid={isPassword ? 'password-input' : 'email-input'}
      aria-invalid={error ? 'true' : 'false'}
    />
  ),
}));

describe('LoginForm: ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('twitter-logo')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('sign-button')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link')).toBeInTheDocument();
  });

  it('has correct placeholders', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    mockLoginWithPassword.mockResolvedValue({});

    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows success toast and redirects on successful login', async () => {
    mockLoginWithPassword.mockResolvedValue({});

    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Success!',
        'You are login successfully!',
        'success',
      );
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it('shows error toast on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLoginWithPassword.mockRejectedValue(new Error(errorMessage));

    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Error!',
        errorMessage,
        'error',
      );
    });
  });

  it('shows generic error message for unknown errors', async () => {
    mockLoginWithPassword.mockRejectedValue('Unknown error');

    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Error!',
        'Something went wrong!',
        'error',
      );
    });
  });
});
