import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  // ESTADO
  theme: Theme;
  initialized: boolean;
  // ACCIONES
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

// Función helper para obtener el tema inicial
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme") as Theme | null;
  return saved || "dark";
};

// Crear el store
export const useThemeStore = create<ThemeStore>((set, get) => ({

  theme: "dark", // Valor por defecto, se inicializará en el cliente
  initialized: false,
  
  // Inicializar el tema desde localStorage o valor por defecto
  initTheme: () => {
    if (typeof window === "undefined" || get().initialized) return;
    
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const theme = savedTheme || "dark";
    
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme, initialized: true });
  },
  
  // Cambiar el tema
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return { theme: newTheme };
    });
  },
  
  // Establecer un tema específico
  setTheme: (theme: Theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  },
}));

