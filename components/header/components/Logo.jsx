"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OneTimeLifeTravelLogo({ compact = false, mobileIconOnly = false, className = "" }) {
  const gold = "#e0bf78";
  const ink = "#f7f1e6";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`flex shrink-0 items-center ${className}`}
    >
      <Link href="/" aria-label="One Time Life Travel home" className="flex items-center gap-2.5">
        <svg width={compact ? "48" : "42"} height={compact ? "48" : "42"} viewBox="0 0 48 48" role="img" aria-label="Eye of Horus emblem" className="shrink-0">
          <path d="M6 24c7-11 20-15 35-8l5 3-5 3c-15-7-28-3-35 8 3-2 6-3 10-3 6 0 11 3 15 7-7 2-13 1-18-2-3-2-5-5-7-8Z" fill="none" stroke={gold} strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="25" cy="24" r="3.5" fill={gold} />
          <path d="M27 32c1 4 0 8-3 11M8 25 3 30" fill="none" stroke={gold} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <span className={`${mobileIconOnly ? "hidden lg:flex" : "flex"} flex-col leading-none`}>
          <span className={`font-[Cinzel] font-bold tracking-[0.12em] ${compact ? "text-[17px]" : "text-[15px]"}`} style={{ color: ink }}>ONE TIME LIFE</span>
          <span className={`mt-1 font-semibold uppercase tracking-[0.34em] ${compact ? "text-[11px]" : "text-[10px]"}`} style={{ color: gold }}>TRAVEL</span>
        </span>
      </Link>
    </motion.div>
  );
}
