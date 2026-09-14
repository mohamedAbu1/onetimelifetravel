"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function HeroText() {
  const { theme } = useTheme();
  const { t } = useTranslation("home");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="hero-copy-content max-w-3xl"
    >
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[var(--logo-border)] sm:text-sm">
        {t("welcome")}
      </p>
      <h1 id="hero-title" className="font-[Cinzel] text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-6xl lg:text-[5.8rem]">
        {t("brand")}
      </h1>
      <p className="mt-4 max-w-xl text-sm font-semibold uppercase tracking-[0.12em] text-[var(--logo-border)]/90 sm:text-base">
        {t("seoIntro")}
      </p>
      <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text)]/70 sm:text-xl">
        {t("Discover")}
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
        <Link href={`/${locale}/trips`} className={`dust-interactive rounded-full px-7 py-3.5 text-sm font-bold tracking-wide shadow-xl transition hover:-translate-y-0.5 ${theme.buttonPrimary}`}>
          {t("journey")}
        </Link>
        <Link href="#featured-trips" className="dust-interactive rounded-full border border-[var(--logo-border)]/45 bg-transparent px-7 py-3.5 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--logo-border)]/10">
          {t("Explore")}
        </Link>
      </div>
    </motion.div>
  );
}
