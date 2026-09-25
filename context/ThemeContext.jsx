"use client";
import { createContext, useContext, useEffect, useState } from "react";
import darkTheme from "@/constants/theme/darkTheme";
import lightTheme from "@/constants/theme/lightTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("dark");
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme === "light" ? "light" : "dark");
  }, []);

  const applyTheme = (mode) => {
    const nextTheme = mode === "light" ? "light" : "dark";
    const nextThemeConfig = nextTheme === "light" ? lightTheme : darkTheme;
    setThemeName(nextTheme);
    setTheme(nextThemeConfig);

    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.setProperty("--color", nextTheme === "dark" ? "#c9a34a" : "#8a6426");
    document.documentElement.style.setProperty("--foreground", nextTheme === "dark" ? "#ededed" : "#18343b");
    document.documentElement.style.setProperty("--background", nextTheme === "dark" ? "#050505" : "#f7f3ea");
    localStorage.setItem("theme", nextTheme);
  };

  const toggleThemeFun = () => applyTheme(themeName === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleThemeFun }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
