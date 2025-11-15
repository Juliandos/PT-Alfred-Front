"use client";

import { useEffect } from "react";
import { useThemeStore } from "../stores/theme.store";
import ThemeToggle from "./ThemeToggle";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Inicializar tema al montar el componente
    initTheme();
  }, [initTheme]);

  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}

