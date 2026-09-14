"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useSeasonalEvent } from "./useSeasonalEvent";

const symbols = [
  "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
  "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
];

export default function EgyptianBackground() {
  const [items, setItems] = useState([]);
  const { theme, themeName } = useTheme();
  const seasonalEvent = useSeasonalEvent();

  useEffect(() => {
    const count = window.innerWidth < 768 ? 16 : 28;
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      symbol: (seasonalEvent?.symbols || symbols)[Math.floor(Math.random() * (seasonalEvent?.symbols || symbols).length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 18 + Math.random() * 35,
      opacity: 0.1 + Math.random() * 0.4,
      rotate: Math.random() * 360,
      delay: Math.random() * 5,
    }));
    setItems(generated);
  }, [seasonalEvent?.key]);

  return (
    <div className="egyptian-background absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((item) => (
        <motion.span
          key={item.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: item.opacity }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            transform: `rotate(${item.rotate}deg)`,
            color: seasonalEvent ? "var(--season-main)" : theme.icon,
            filter: "blur(0.5px)",
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
}
