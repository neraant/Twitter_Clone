import { fireEvent, render, screen } from '@testing-library/react';

import { useAuthStore } from '@/features/auth';
import { routes } from '@/shared/config/routes';

import {
  SIGN_WITH_EMAIL_LABEL,
  SIGN_WITH_GOOGLE,
  SUBTITLE,
  TEXTS,
  TITLE,
} from '../../lib';
import { WelcomeForm } from '../WelcomeForm';

jest.mock('@/features/auth', () => ({
  SignTypeButton: ({ label, onClick, href, children }: never) => (
    <button onClick={onClick} data-testid={`button-${label}`} data-href={href}>
      {children}
      {label}
    </button>
  ),
  useAuthStore: jest.fn(),
}));

jest.mock('@/shared/ui/icon', () => ({
  GoogleLogoIcon: ({ width, height }: never) => (
    <svg data-testid='google-icon' width={width} height={height} />
  ),
  TwitterLogoIcon: ({ className, width, height }: never) => (
    <svg
      data-testid='twitter-icon'
      className={className}
      width={width}
      height={height}
    />
  ),
}));

describe('<WelcomeForm />', () => {
  const mockLoginWithGoogle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ loginWithGoogle: mockLoginWithGoogle }),
    );
  });

  it('renders the Twitter logo', () => {
    render(<WelcomeForm />);
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });

  it('renders the title and subtitle', () => {
    render(<WelcomeForm />);
    expect(screen.getByText(TITLE)).toBeInTheDocument();
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument();
  });

  it('renders the Google sign-in button with icon', () => {
    render(<WelcomeForm />);
    expect(screen.getByTestId('google-icon')).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${SIGN_WITH_GOOGLE}`),
    ).toBeInTheDocument();
  });

  it('calls loginWithGoogle when Google button is clicked', () => {
    render(<WelcomeForm />);
    const googleButton = screen.getByTestId(`button-${SIGN_WITH_GOOGLE}`);
    fireEvent.click(googleButton);
    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it('renders the Email sign-up button with correct href', () => {
    render(<WelcomeForm />);
    const emailButton = screen.getByTestId(`button-${SIGN_WITH_EMAIL_LABEL}`);
    expect(emailButton).toBeInTheDocument();
    expect(emailButton).toHaveAttribute('data-href', routes.auth.signUp);
  });

  it('renders the "Have account" text with login link', () => {
    render(<WelcomeForm />);

    expect(screen.getByText(TEXTS.haveAccount)).toBeInTheDocument();
    const logInLink = screen.getByText(TEXTS.logIn);
    expect(logInLink).toHaveAttribute('href', routes.auth.login);
  });
});
