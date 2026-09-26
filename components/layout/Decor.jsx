"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSeasonalEvent } from "./useSeasonalEvent";

export default function Decor({ pos }) {
  const { theme } = useTheme();
  const seasonalEvent = useSeasonalEvent();
  const containerRef = useRef(null);
  const [symbolsCount, setSymbolsCount] = useState(8);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // ✅ حساب عدد الرموز حسب عرض الـ container
      let count = Math.floor(width / 180);
      if (count < 4) count = 4;
      if (count > 10) count = 10;
      setSymbolsCount(count);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`absolute w-full ${pos}-0 flex justify-around`}>
      {Array.from({ length: symbolsCount }).map((_, i) => (
        <span
          key={i}
          className="text-4xl md:text-5xl lg:text-6xl text-gradient"
          style={{
            filter: `drop-shadow(0 0 6px ${theme.logoBorder || "#C2A878"})`,
          }}
        >
          {seasonalEvent?.symbols?.[i % seasonalEvent.symbols.length] || "𓎛"}
        </span>
      ))}
    </div>
  );
}
