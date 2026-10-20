
"use client";

import { clientEnv } from "@/config/env.client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = `${clientEnv.NEXT_PUBLIC_APP_THEME_NAME}`;

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (
      stored === "light" ||
      stored === "dark" ||
      stored === "system"
    ) {
      return stored;
    }
  } catch {
    // Storage may be unavailable. Fall back to system preference.
  }

  return "system";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolvedTheme =
    theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle(
    "dark",
    resolvedTheme === "dark",
  );

  document.documentElement.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>("light");
  const [initialized, setInitialized] = useState(false);

  // Read the saved preference before allowing the provider to apply a theme.
  useEffect(() => {
    setThemeState(getStoredTheme());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    setResolvedTheme(applyTheme(theme));

    if (theme !== "system") return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleSystemThemeChange = () => {
      setResolvedTheme(applyTheme("system"));
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange,
      );
    };
  }, [theme, initialized]);

  const setTheme = useCallback((nextTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Theme can still change for the current session.
    }

    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
