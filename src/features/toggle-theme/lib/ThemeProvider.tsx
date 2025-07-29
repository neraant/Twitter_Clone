'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DEFAULT_THEME,
  Theme,
  THEME_STORAGE_KEY,
  THEMES,
} from '@/shared/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
  systemTheme: Theme;
}

const isServer = typeof window === 'undefined';
const MEDIA = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (isServer) return THEMES.LIGHT;
  return window.matchMedia(MEDIA).matches ? THEMES.DARK : THEMES.LIGHT;
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [systemTheme, setSystemTheme] = useState<Theme>(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  const resolvedTheme =
    theme === THEMES.SYSTEM ? systemTheme : (theme as Theme);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    const currentSystemTheme = getSystemTheme();

    setSystemTheme(currentSystemTheme);

    if (
      savedTheme &&
      [THEMES.DARK, THEMES.LIGHT, THEMES.SYSTEM].includes(savedTheme)
    ) {
      setThemeState(savedTheme);
    } else {
      setThemeState(THEMES.SYSTEM);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    applyTheme(resolvedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, resolvedTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, systemTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themeScript = `
  (function() {
    if (typeof window === 'undefined') return;
    try {
      var theme = localStorage.getItem('theme') || 'system';
      var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var resolvedTheme = theme === 'system' ? systemTheme : theme;
      
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.documentElement.style.colorScheme = resolvedTheme;
    } catch (e) {}
  })();
`;
