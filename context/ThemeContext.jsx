"use client";
import { createContext, useContext, useEffect, useState } from "react";
import darkTheme from "@/constants/theme/darkTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("dark");
  const [theme, setTheme] = useState(darkTheme);

  // الموقع يستخدم الهوية الداكنة فقط.
  useEffect(() => {
    localStorage.removeItem("theme");
    applyTheme("dark");
  }, []);

  // ✅ دالة لتطبيق الثيم
  const applyTheme = (mode) => {
    setThemeName("dark");
    setTheme(darkTheme);

    // تحديث الـ attribute على <html>
    document.documentElement.setAttribute("data-theme", "dark");

    // تحديث الـ class الخاصة بـ Tailwind (لو محتاج dark:)
    document.documentElement.classList.add("dark");

    // تحديث بعض الـ CSS variables العامة
    document.documentElement.style.setProperty(
      "--color",
      "#c9a34a"
    );
    document.documentElement.style.setProperty(
      "--foreground",
      "#ededed"
    );
    document.documentElement.style.setProperty(
      "--background",
      "#050505"
    );
  };

  // الحفاظ على الواجهة البرمجية القديمة بدون السماح بتفعيل الوضع الفاتح.
  const toggleThemeFun = () => applyTheme("dark");

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleThemeFun }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
