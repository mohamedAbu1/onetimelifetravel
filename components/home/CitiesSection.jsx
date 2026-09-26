"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CityCard({ city, index, language, t, tc }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const [currentImage, setCurrentImage] = useState(0);
  const cityName = city.name?.[language] || city.name?.en || city.name || "";
  const images = city.images?.filter(Boolean).slice(0, 2) || [];
  const imageSources = images.length ? images : ["/fallback.jpg"];

  useEffect(() => {
    if (imageSources.length < 2) return undefined;
    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % imageSources.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageSources.length]);

  const handleExplore = () => {
    const query = encodeData({ city: [cityName], category: "all", price: "All", popular: false });
    router.push(`/${locale}/trips?data=${query}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3) }}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[#151515] shadow-[0_18px_50px_rgba(0,0,0,.22)] ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <div className={`relative min-h-[245px] ${index === 0 ? "md:min-h-[510px]" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div key={imageSources[currentImage]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <Image src={imageSources[currentImage]} alt={cityName || "Egyptian destination"} fill sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"} quality={58} className="object-cover transition duration-700 group-hover:scale-105" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/5" />
        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d1b06a] backdrop-blur-md">0{index + 1} · Egypt</div>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d1b06a]">{tc("exploreDestination")}</p>
            <h3 className="font-[Cinzel] text-2xl font-semibold text-[#f4ead8] md:text-3xl">{cityName}</h3>
          </div>
          <button type="button" onClick={handleExplore} className="shrink-0 rounded-full border border-[#d1b06a]/70 bg-[#d1b06a] px-4 py-2 text-xs font-semibold text-[#16130f] transition hover:bg-[#ead39e] focus:outline-none focus:ring-2 focus:ring-[#d1b06a] focus:ring-offset-2 focus:ring-offset-black">{t("Explore")}</button>
        </div>
      </div>
    </motion.article>
  );
}

export default function CitiesSection() {
  const { t, i18n } = useTranslation("home");
  const { t: tc } = useTranslation("common");
  const { cities, loading, error, reload } = useCitiesCategories();
  const language = i18n.language.split("-")[0];

  if (loading) {
    return <section className="site-section w-full px-6 py-20" aria-label="Loading destinations"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-64 animate-pulse rounded-[1.75rem] border border-[var(--logo-border)]/20 bg-[var(--card-bg)]" />)}</div></section>;
  }

  return (
    <section id="destinations" className="site-section w-full overflow-hidden bg-[var(--background)] px-5 py-20 text-[var(--text)] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d1b06a]">One Time Life Travel · Destinations</p><h2 className="max-w-2xl font-[Cinzel] text-3xl font-semibold leading-tight text-[#f4ead8] md:text-5xl">{t("ExploreCities")}</h2></div>
          <p className="max-w-md text-sm leading-7 text-[#b8b0a2] md:text-right">{tc("destinationsCopy")}</p>
        </div>
        {error ? <div role="alert" className="rounded-[1.75rem] border border-red-700/30 bg-red-950/10 px-6 py-16 text-center"><h3 className="font-[Cinzel] text-2xl text-[var(--heading)]">{tc("dataUnavailable", { defaultValue: "Destinations are temporarily unavailable" })}</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("tryAgainLater", { defaultValue: "Please try again in a moment." })}</p><button type="button" onClick={reload} className="mt-5 rounded-full bg-[var(--primary-color)] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-[#15120e]">{tc("retry", { defaultValue: "Try again" })}</button></div> : cities.length ? <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">{cities.map((city, index) => <CityCard key={city.id || city.name?.en || index} city={city} index={index} language={language} t={t} tc={tc} />)}</div> : <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card-bg)] px-6 py-16 text-center"><h3 className="font-[Cinzel] text-2xl text-[var(--heading)]">{tc("destinationsEmpty")}</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("destinationsPreparing")}</p></div>}
      </div>
    </section>
  );
}
