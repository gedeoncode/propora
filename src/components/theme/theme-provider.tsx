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

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = `${clientEnv.NEXT_PUBLIC_APP_NAME}-theme`;

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const resolvedTheme =
    theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle(
    "dark",
    resolvedTheme === "dark",
  );

  document.documentElement.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  return storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
    ? storedTheme
    : "system";
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("system");

  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark"
  >("light");

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  useEffect(() => {
    setResolvedTheme(applyTheme(theme));

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (theme !== "system") {
      return;
    }

    const handleSystemThemeChange = () => {
      setResolvedTheme(applyTheme("system"));
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange,
    );

    return () =>
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange,
      );
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(
      resolvedTheme === "dark" ? "light" : "dark",
    );
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
    throw new Error(
      "useTheme must be used within a ThemeProvider",
    );
  }

  return context;
}