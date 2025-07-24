import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

import { RegisterForm } from '../RegisterForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/features/auth', () => ({
  SignButton: ({ label, isLoading }: { label: string; isLoading: boolean }) => (
    <button disabled={isLoading} data-testid='sign-button'>
      {label}
    </button>
  ),
  useAuthStore: jest.fn(),
}));

jest.mock('@/shared/lib/toast/useToast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/shared/ui/dropdown-list/DropDownList', () => ({
  DropDownList: ({
    options,
    selected,
    onSelect,
    placeholder,
  }: {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder: string;
  }) => (
    <select
      data-testid={`dropdown-${placeholder}`}
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value=''>{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

type IconProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

jest.mock('@/shared/ui/icon', () => ({
  TwitterLogoIcon: ({ className, width, height }: IconProps) => (
    <div className={className} style={{ width, height }}>
      TwitterIcon
    </div>
  ),
}));

type SignInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  error?: { message: string };
};

jest.mock('@/shared/ui/sign-input', () => ({
  SignInput: ({ placeholder, error, ...props }: SignInputProps) => (
    <div>
      <input placeholder={placeholder} {...props} />
      {error && <span>{error.message}</span>}
    </div>
  ),
}));

jest.mock('../../lib', () => ({
  AGE_BODY: 'Age body text',
  AGE_TITLE: 'Age title',
  BUTTON_LABEL: 'Sign Up',
  PLACEHOLDERS: {
    NAME: 'Name',
    PHONE: 'Phone',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    MONTH: 'Month',
    DAY: 'Day',
    YEAR: 'Year',
  },
  TITLE: 'Create your account',
  USE_GOOGLE_LINK: 'Use Google',
  registerSchema: yup.object({
    name: yup.string(),
    email: yup.string().email(),
    phoneNumber: yup.string(),
    password: yup.string(),
    confirmPassword: yup.string(),
  }),
  useDateSelector: jest.fn(),
}));

import { useAuthStore } from '@/features/auth';
import { useToast } from '@/shared/lib/toast/useToast';

import { useDateSelector } from '../../lib';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSignUpWithPassword = jest.fn();
const mockShowToast = jest.fn();
const mockUseDateSelector = {
  selected: { day: '', month: '', year: '' },
  daysOptions: ['1', '2', '3'],
  months: ['January', 'February', 'March'],
  years: ['2023', '2022', '2021'],
  handleSelectDay: jest.fn(),
  handleSelectMonth: jest.fn(),
  handleSelectYear: jest.fn(),
  formatDate: jest.fn().mockReturnValue('2023-01-01'),
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        signUpWithPassword: mockSignUpWithPassword,
        isLoadingSignUp: false,
      };
      return selector(state);
    });

    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });

    (useDateSelector as jest.Mock).mockReturnValue(mockUseDateSelector);
  });

  it('should render form with all inputs', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('should render dropdowns for date selection', () => {
    render(<RegisterForm />);

    expect(screen.getByTestId('dropdown-Month')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-Day')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-Year')).toBeInTheDocument();
  });

  it('should call handleSelectMonth when month is selected', () => {
    render(<RegisterForm />);

    const monthDropdown = screen.getByTestId('dropdown-Month');
    fireEvent.change(monthDropdown, { target: { value: 'January' } });

    expect(mockUseDateSelector.handleSelectMonth).toHaveBeenCalledWith(
      'January',
    );
  });

  it('should call handleSelectDay when day is selected', () => {
    render(<RegisterForm />);

    const dayDropdown = screen.getByTestId('dropdown-Day');
    fireEvent.change(dayDropdown, { target: { value: '15' } });

    expect(mockUseDateSelector.handleSelectDay).toHaveBeenCalled();
  });

  it('should call handleSelectYear when year is selected', () => {
    render(<RegisterForm />);

    const yearDropdown = screen.getByTestId('dropdown-Year');
    fireEvent.change(yearDropdown, { target: { value: '2023' } });

    expect(mockUseDateSelector.handleSelectYear).toHaveBeenCalledWith('2023');
  });

  it('should submit form with correct data', async () => {
    mockSignUpWithPassword.mockResolvedValue(undefined);

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone'), {
      target: { value: '+1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByTestId('sign-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUpWithPassword).toHaveBeenCalledWith({
        password: 'password123',
        name: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        dateOfBirth: '2023-01-01',
      });
    });
  });

  it('should show success toast and redirect on successful signup', async () => {
    mockSignUpWithPassword.mockResolvedValue(undefined);

    render(<RegisterForm />);

    const submitButton = screen.getByTestId('sign-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Success!',
        'You are sign up successfully!',
        'success',
      );
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it('should show error toast on signup failure', async () => {
    const error = new Error('Signup failed');
    mockSignUpWithPassword.mockRejectedValue(error);

    render(<RegisterForm />);

    const submitButton = screen.getByTestId('sign-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Error!',
        'Signup failed',
        'error',
      );
    });
  });

  it('should show generic error toast for unknown error', async () => {
    mockSignUpWithPassword.mockRejectedValue('Unknown error');

    render(<RegisterForm />);

    const submitButton = screen.getByTestId('sign-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Error!',
        'Something went wrong!',
        'error',
      );
    });
  });

  it('should disable button when loading', () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        signUpWithPassword: mockSignUpWithPassword,
        isLoadingSignUp: true,
      };
      return selector(state);
    });

    render(<RegisterForm />);

    const submitButton = screen.getByTestId('sign-button');
    expect(submitButton).toBeDisabled();
  });

  it('should render title and age information', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Age title')).toBeInTheDocument();
    expect(screen.getByText('Age body text')).toBeInTheDocument();
  });

  it('should render Google link', () => {
    render(<RegisterForm />);

    const googleLink = screen.getByText('Use Google');
    expect(googleLink).toBeInTheDocument();
  });
});
