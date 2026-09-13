"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// أيقونة أنخ بتدرج من الثيم باستخدام class text-gradient
const AnkhIcon = () => (
  <span
    className="text-xl font-bold text-gradient"
    style={{
      filter: "drop-shadow(0 0 4px rgba(194,168,120,0.6))",
    }}
  >
    ☥
  </span>
);

export default function Divider({ fadeUp }) {
  const { themeName } = useTheme();

  return (
    <motion.div
      variants={fadeUp}
      className="relative flex items-center justify-center my-6"
    >
      {/* الخط المتدرج */}
      <hr
        className="w-full border-t-2"
        style={{
          borderImage: "var(--text-gradient) 1", // ✅ استخدام CSS variable
          borderImageSlice: 1,
          opacity: themeName === "dark" ? 0.5 : 0.7,
        }}
      />
      {/* أيقونة أنخ في المنتصف */}
      <div className="absolute bg-inherit px-2">
        <AnkhIcon />
      </div>
    </motion.div>
  );
}
