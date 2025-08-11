import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "neon";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("abrev-theme") as Theme;
      return saved || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove todas as classes de tema
    root.classList.remove("light", "dark", "neon");
    
    // Adiciona a classe do tema atual
    root.classList.add(theme);
    
    // Salva no localStorage
    localStorage.setItem("abrev-theme", theme);
    
    // Aplica as variáveis CSS específicas do tema
    if (theme === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "240 10% 3.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "240 10% 3.9%");
      root.style.setProperty("--primary", "199 100% 50%");
      root.style.setProperty("--muted", "240 4.8% 95.9%");
      root.style.setProperty("--muted-foreground", "240 3.8% 46.1%");
    } else if (theme === "neon") {
      root.style.setProperty("--background", "240 10% 3.9%");
      root.style.setProperty("--foreground", "0 0% 98%");
      root.style.setProperty("--card", "240 10% 3.9%");
      root.style.setProperty("--card-foreground", "0 0% 98%");
      root.style.setProperty("--primary", "280 100% 70%");
      root.style.setProperty("--muted", "240 3.7% 15.9%");
      root.style.setProperty("--muted-foreground", "240 5% 64.9%");
    } else {
      // dark (default)
      root.style.setProperty("--background", "216 24% 12%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "216 24% 15%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--primary", "199 100% 50%");
      root.style.setProperty("--muted", "216 24% 16%");
      root.style.setProperty("--muted-foreground", "215 20% 65%");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}