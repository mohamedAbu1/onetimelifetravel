"use client";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { themeName, toggleThemeFun } = useTheme();
  const isDark = themeName === "dark";

  return (
    <button
      type="button"
      onClick={toggleThemeFun}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="theme-toggle"
    >
      <span className="theme-toggle-icon">{isDark ? <FaSun /> : <FaMoon />}</span>
      <span className="hidden xl:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
