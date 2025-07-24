import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ToggleThemeButton } from '../ToggleThemeButton';

jest.mock('@/features/toggle-theme/lib', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/shared/lib/theme', () => ({
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
}));

import { useTheme } from '@/features/toggle-theme/lib';

const mockSetTheme = jest.fn();

describe('ToggleThemeButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render enabled button when mounted', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  it('should toggle from light to dark theme', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should toggle from dark to light theme', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
    });

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should apply dark styles when resolved theme is dark', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('toggled');
    });
  });

  it('should not apply dark styles when resolved theme is light', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('toggled');
    });
  });

  it('should handle system theme correctly', async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ToggleThemeButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('toggled');

      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });
});
