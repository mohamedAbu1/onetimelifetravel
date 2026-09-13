"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import EgyptianBackground from "../layout/EgyptianBackground";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CategoryCard({ cat, theme, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

  const luxuryNames = [
    "Luxusreisen",
    "Luxury Tours",
    "Tours de lujo",
    "Voyages de luxe",
    "Tour di lusso",
    "豪华旅游",
  ];

  const handleClick = () => {
    const queryObj = {
      city: "all",
      category: [displayName],
      group_price: luxuryNames.includes(displayName) ? "Luxury" : "All",
      popular: false,
    };
    const encoded = encodeData(queryObj);
    router.push(`/${locale}/trips?data=${encoded}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`editorial-card dust-interactive group relative h-[320px] cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${theme.card}`}
      style={{ border: `1px solid ${theme.logoBorder}` }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={imgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={
              cat.images?.[imgIndex]?.startsWith("/")
                ? cat.images[imgIndex]
                : cat.images?.[imgIndex]?.startsWith("http")
                ? cat.images[imgIndex]
                : "/fallback.jpg"
            }
            alt={displayName}
            fill
            className="object-cover opacity-85 transition duration-700 group-hover:scale-105"
          />
        </motion.div>
      </AnimatePresence>

      <div
          className={`absolute inset-0 ${theme.overlay} flex items-end justify-start p-6`}
      >
        <p
          className="trips-text text-lg font-semibold tracking-wide drop-shadow-lg"
        >
          {displayName}
        </p>
      </div>
    </div>
  );
}

const CategoriesSection = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { categories, loading } = useCitiesCategories();
  const [index, setIndex] = useState(0);
  const normalizedLang = i18n.language.split("-")[0];

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!categories.length) return undefined;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  if (loading) {
    return (
      <section className="site-section w-full px-6" aria-label="Loading travel styles">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="editorial-card h-72 animate-pulse rounded-2xl border bg-white/5" />)}
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="site-section flex min-h-[320px] w-full flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--logo-border)]">Travel styles</p>
        <h2 className="mt-4 font-[Cinzel] text-3xl font-semibold text-[var(--heading)]">A journey made for you</h2>
        <p className="mt-4 max-w-lg leading-8 text-[var(--sub-text)]">Choose a private tour, Nile cruise, cultural escape, or desert adventure and we will take care of the details.</p>
      </section>
    );
  }

  // الرموز الفرعونية للديكور
  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];

  // ضبط عرض الكارد حسب الشاشة
  const cardWidth = screenSize.width < 640 ? screenSize.width : 220;

  return (
    <section
      className={`site-section flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500 ${theme.background}`}
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-10 pointer-events-none">
        {symbols.map((sym, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="text-6xl m-6"
            style={{ color: theme.icon }}
          >
            {sym}
          </motion.span>
        ))}
      </div>
      <EgyptianBackground />

      {/* العنوان */}
      <div className="max-w-7xl mx-auto items-center mb-10 text-center relative z-10">
        <h2 className="sc-title-first text-2xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient">
          <span className="inline-block transform scale-x-[-1] text-gradient mr-4">
            𓅓
          </span>
          {t("ExploreCategories")}
          <span className="inline-block ml-4 text-gradient">𓅓</span>
        </h2>
        <p className="sc-p-first mt-4 capitalize text-lg opacity-80 text-start text-gradient">
          {t("Discover")}
        </p>
        <DividerWithIcon />
      </div>

      {/* نسخة الموبايل */}
      <div className="lg:hidden flex flex-col items-center gap-6 w-full">
        <motion.div
          className="w-[90%] max-w-sm"
          drag="x"
          dragConstraints={{ left: -screenSize.width / 3, right: screenSize.width / 3 }}
          animate={{ x: -index * cardWidth + (screenSize.width - cardWidth) / 2 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <CategoryCard
            cat={categories[index]}
            theme={theme}
            language={normalizedLang}
          />
        </motion.div>

        {/* مؤشرات أسفل الكارد */}
        <div className="flex gap-2 mt-4">
          {categories.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-[var(--logo-border)]" : "bg-white/30"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* نسخة الديسكتوب */}
      <div className="hidden lg:block relative overflow-hidden w-full max-w-7xl mx-auto z-10">
        <motion.div
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: -categories.length * cardWidth, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
          animate={{ x: -index * cardWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3 flex justify-center"
            >
              <CategoryCard
                cat={cat}
                theme={theme}
                language={normalizedLang}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
