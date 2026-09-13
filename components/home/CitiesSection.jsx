"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Decor from "../layout/Decor";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CityCard({ city, themeName, theme, language, t }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const cityName =
    city.name?.[language] || city.name?.["en"] || city.name || "";

  const handleExplore = () => {
    const queryObj = {
      city: [cityName],
      category: "all",
      price: "All",
      popular: false,
    };
    const encoded = encodeData(queryObj);
    router.push(`/${locale}/trips?data=${encoded}`);
  };

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const images = city.images?.slice(0, 2) || ["/fallback.jpg", "/fallback.jpg"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-w-[250px] p-4"
    >
      <div
        className={`dust-interactive relative h-82 rounded-2xl overflow-hidden group cursor-pointer
          ${theme.card} ${theme.border} ${theme.shadow}
          transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1`}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImage]}
              alt={cityName || "City image"}
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className={`absolute inset-0 ${theme.overlay} flex flex-col items-center justify-end pb-6`}
        >
          <p
            className={`trips-text text-lg font-bold mb-2 ${theme.title}`}
            style={{
              WebkitTextStroke:
                themeName === "dark" ? "1px #C2A878" : "1px #ffffff",
              textShadow:
                themeName === "dark"
                  ? "2px 2px 6px rgba(0,0,0,0.6)"
                  : "2px 2px 6px rgba(255,255,255,0.3)",
            }}
          >
            {cityName}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplore}
            className={`rounded-[9px] px-3 py-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
            style={{ border: `2px solid ${theme.logoBorder}` }}
          >
            {t("Explore")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const CitiesSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { cities, loading } = useCitiesCategories();
  const normalizedLang = i18n.language.split("-")[0];

  // ✅ hooks لازم تكون فوق
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <section className="site-section w-full px-6" aria-label="Loading destinations">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="editorial-card h-80 animate-pulse rounded-2xl border bg-white/5" />)}
        </div>
      </section>
    );
  }

  if (!cities.length) {
    return (
      <section className="site-section flex min-h-[360px] w-full flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--logo-border)]">Destinations</p>
        <h2 className="mt-4 font-[Cinzel] text-3xl font-semibold text-[var(--heading)]">Luxor, Aswan and beyond</h2>
        <p className="mt-4 max-w-lg leading-8 text-[var(--sub-text)]">Tell us where you want to go and our local experts will build the right Egyptian route around you.</p>
      </section>
    );
  }

  const looped = [...cities, ...cities];

  // ✅ الرموز الفرعونية للديكور
  const symbols = [
    "𓂀",
    "𓋹",
    "𓆣",
    "𓇼",
    "𓇯",
    "𓏏",
    "𓎛",
    "𓊽",
    "𓃾",
    "𓅓",
    "𓈇",
    "𓉐",
    "𓊹",
    "𓌙",
    "𓍿",
    "𓎟",
  ];

  return (
    <section
      className="site-section flex w-full min-h-[560px] relative bg-cover bg-center flex-col items-center justify-center overflow-hidden px-4 py-16"
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 pointer-events-none">
        {symbols.map((sym, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.15, y: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1 }}
            className="absolute text-6xl"
            style={{
              top: `${8 + ((i * 23) % 86)}%`,
              left: `${4 + ((i * 31) % 92)}%`,
              transform: `rotate(${(i * 29) % 360}deg)`,
              color: theme.icon,
            }}
          >
            {sym}
          </motion.span>
        ))}
      </div>
      <Decor pos={"top"} />

      <div className="max-w-2xl mx-auto mb-16 w-full relative z-10 pt-12">
        <h2
          className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-center text-gradient2"
          style={{ textAlign: "center" }}
        >
          <span className="inline-block transform text-gradient2 scale-x-[-1] mr-4">𓅓</span>
          {t("ExploreCities")}
          <span className="inline-block text-gradient2 ml-4">𓅓</span>
        </h2>
         <p className="sc-p-first mt-4 capitalize text-lg opacity-80 text-center text-gradient">
          Cities where we operate professionally
        
        </p>
        <DividerWithIcon />
      </div>

      {/* ✅ Marquee Animation */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto h-[410px] z-10">
        <motion.div
          className="flex h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {looped.map((city, i) => (
            <CityCard
              key={i}
              city={city}
              t={t}
              themeName={themeName}
              theme={theme}
              language={normalizedLang}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CitiesSection;
