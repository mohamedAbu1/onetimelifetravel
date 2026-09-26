"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import EgyptianBackground from "../layout/EgyptianBackground";

const encodeData = (value) => btoa(JSON.stringify(value));

function getDisplayName(category, language) {
  if (typeof category?.name === "object") {
    return category.name?.[language] || category.name?.en || "Travel experience";
  }
  return category?.name || "Travel experience";
}

function CategoryCard({ category, language, theme, tc }) {
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const name = getDisplayName(category, language);
  const images = Array.isArray(category?.images) ? category.images.filter(Boolean) : [];
  const image = images[imageIndex] || images[0] || "/fallback.jpg";

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = setInterval(() => setImageIndex((current) => (current + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const openCategory = () => {
    const query = encodeData({ city: "all", category: [name], group_price: "All", popular: false });
    router.push(`/${locale}/trips?data=${query}`);
  };

  return (
    <motion.button
      type="button"
      onClick={openCategory}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      className="category-card group relative isolate flex min-h-[280px] w-full overflow-hidden rounded-[1.35rem] border text-left shadow-[0_18px_50px_rgba(0,0,0,.22)] transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,.34)] sm:min-h-[320px]"
      style={{ borderColor: "rgba(194,168,120,.5)", background: theme.card }}
      aria-label={`${tc("exploreJourneys")} ${name}`}
    >
      <Image unoptimized src={image} alt={name} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 23vw" quality={58} className="object-cover transition duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="mb-3 inline-flex rounded-full border border-[var(--logo-border)]/45 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--logo-border)] backdrop-blur-sm">One Time Life</span>
        <h3 className="font-[Cinzel] text-xl font-semibold leading-tight text-[#f7f1e6] sm:text-2xl">{name}</h3>
        <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#e0bf78]">{tc("exploreJourneys")} <span aria-hidden="true">→</span></span>
      </div>
    </motion.button>
  );
}

export default function CategoriesSection() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: tc } = useTranslation("common");
  const { categories, loading, error, reload } = useCitiesCategories();
  const language = i18n.language.split("-")[0];

  return (
    <section id="categories" className="site-section relative w-full overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <EgyptianBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.3em] text-[var(--logo-border)]">One Time Life Travel</p>
            <h2 className="mt-3 font-[Cinzel] text-3xl font-semibold leading-tight text-[var(--heading)] sm:text-4xl lg:text-5xl">{t("ExploreCategories")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--sub-text)] sm:text-base">{t("Discover")}</p>
          </div>
          <a href="#featured-trips" className="self-start rounded-full border border-[var(--logo-border)]/60 px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-[var(--logo-border)] transition hover:bg-[var(--logo-border)] hover:text-[#15120e] sm:self-auto">{tc("viewFeaturedTrips")}</a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="flex h-[280px] animate-pulse items-end rounded-[1.35rem] border border-[var(--logo-border)]/20 bg-[var(--card-bg)] p-5 sm:h-[320px]"><span className="h-4 w-2/3 rounded-full bg-[var(--logo-border)]/20" /></div>)}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-3xl border border-red-700/30 bg-red-950/10 p-10 text-center">
            <h3 className="font-[Cinzel] text-2xl text-[var(--heading)]">{tc("dataUnavailable", { defaultValue: "Travel experiences are temporarily unavailable" })}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("tryAgainLater", { defaultValue: "Please try again in a moment." })}</p>
            <button type="button" onClick={reload} className="mt-5 rounded-full bg-[var(--primary-color)] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-[#15120e] transition hover:brightness-105">{tc("retry", { defaultValue: "Try again" })}</button>
          </div>
        ) : categories.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => <CategoryCard key={category.id || index} category={category} language={language} theme={theme} tc={tc} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--logo-border)]/25 bg-black/10 p-10 text-center backdrop-blur-sm">
            <h3 className="font-[Cinzel] text-2xl text-[var(--heading)]">{tc("journeyStarts")}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("exploreCopy")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
