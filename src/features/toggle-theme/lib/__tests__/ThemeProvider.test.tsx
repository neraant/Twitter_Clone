import { act, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { ThemeProvider, useTheme } from '../ThemeProvider';

jest.mock('@/shared/lib/theme', () => ({
  DEFAULT_THEME: 'system',
  THEME_STORAGE_KEY: 'theme',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
}));

const TestComponent = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  return (
    <div>
      <span data-testid='theme'>{theme}</span>
      <span data-testid='resolved-theme'>{resolvedTheme}</span>
      <span data-testid='system-theme'>{systemTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
};

const renderWithProvider = (children: ReactNode) => {
  return render(<ThemeProvider>{children}</ThemeProvider>);
};

describe('ThemeProvider', () => {
  let mockLocalStorage: { [key: string]: string };
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
      },
      writable: true,
    });

    mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
    });

    Object.defineProperty(document, 'documentElement', {
      value: {
        setAttribute: jest.fn(),
        style: {},
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when useTheme is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('should initialize with system theme when no saved theme', async () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('system-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
  });

  it('should initialize with saved theme from localStorage', async () => {
    mockLocalStorage['theme'] = 'dark';

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });

  it('should detect dark system theme', async () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });

  it('should update theme when setTheme is called', async () => {
    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    const setDarkButton = screen.getByText('Set Dark');

    await act(async () => {
      setDarkButton.click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });

  it('should save theme to localStorage when theme changes', async () => {
    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    const setLightButton = screen.getByText('Set Light');

    await act(async () => {
      setLightButton.click();
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should apply theme to document', async () => {
    const mockSetAttribute = jest.fn();
    const mockStyle: { colorScheme?: string } = {};

    Object.defineProperty(document, 'documentElement', {
      value: {
        setAttribute: mockSetAttribute,
        style: mockStyle,
      },
      writable: true,
    });

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    const setDarkButton = screen.getByText('Set Dark');

    await act(async () => {
      setDarkButton.click();
    });

    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(mockStyle.colorScheme).toBe('dark');
  });

  it('should handle system theme changes', async () => {
    let mediaQueryCallback: (e: MediaQueryListEvent) => void;

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn((_, callback) => {
        mediaQueryCallback = callback;
      }),
      removeEventListener: jest.fn(),
    });

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    expect(screen.getByTestId('system-theme')).toHaveTextContent('light');

    await act(async () => {
      mediaQueryCallback({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
  });

  it('should resolve system theme correctly', async () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    const setSystemButton = screen.getByText('Set System');

    await act(async () => {
      setSystemButton.click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });

  it('should ignore invalid saved themes', async () => {
    mockLocalStorage['theme'] = 'invalid-theme';

    await act(async () => {
      renderWithProvider(<TestComponent />);
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });
});
