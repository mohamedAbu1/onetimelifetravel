"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useSeasonalEvent } from "@/components/layout/useSeasonalEvent";

export default function Background() {
  const { themeName } = useTheme();
  const [index, setIndex] = useState(0);
  const seasonalEvent = useSeasonalEvent();

  const darkImages = [
    "/HomePageImage/banner.62f1bfcb.jpg",
    "/HomePageImage/asdasdas.webp",
    "/HomePageImage/banner.62f1bfcb.jpg",
  ];

  const lightImages = [
    "/HomePageImage/banner.62f1bfcb.jpg",
    "/HomePageImage/_15900_MarsaMatruh.jpg",
    "/HomePageImage/_16106_Untitled-1.jpg",
    "/HomePageImage/_9272_banner-aboutus.jpg",
    "/Nile_Cruise/andres-dallimonti-hOhOltq7gEU-unsplash.webp",
    "/Nile_Cruise/nacho-diaz-latorre-W4Oc4NIL5_U-unsplash.webp",
  ];

  const images = seasonalEvent?.heroImage ? [seasonalEvent.heroImage] : (themeName === "dark" ? darkImages : lightImages);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt="Egypt travel destination"
            fill
            sizes="(max-width: 1023px) 100vw, 47vw"
            quality={58}
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            className="object-cover saturate-[0.8] contrast-[1.08] brightness-[0.78]"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
