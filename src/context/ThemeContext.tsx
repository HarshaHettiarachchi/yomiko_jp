import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("yomiko-theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Enable smooth theme transitions after initial render
    root.classList.add("theme-ready");

    // Apply theme
    root.classList.toggle("dark", darkMode);

    // Save preference
    localStorage.setItem(
      "yomiko-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}