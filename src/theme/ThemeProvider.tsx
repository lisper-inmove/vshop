"use client";
import useTheme from "./use-theme";
import { ReactNode, useEffect } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme, toggleTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
