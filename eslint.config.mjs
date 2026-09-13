// eslint.config.js
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"],
  },
  js.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks, "@next/next": nextPlugin },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-undef": "off",
      "no-unused-vars": "warn",
    },
  },
];
