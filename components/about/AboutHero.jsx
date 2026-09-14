"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function AboutHero() {
  const { t } = useTranslation("about");
  const image = "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp";
  return (
    <section className="pharaonic-hero w-full">
      <Image src={image} alt="Egyptian heritage" fill priority className="object-cover -z-20 opacity-55" />
      <div className="pharaonic-hero-content relative">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-3xl">
          <p className="pharaonic-kicker mb-5">{t("AboutOneTimeLifeTravel")}</p>
          <div className="pharaonic-rule mb-6 max-w-md"><span>𓋹</span></div>
          <h1>{t("h1")}</h1>
          <p className="mt-7 text-lg leading-8">{t("p")}</p>
        </motion.div>
      </div>
      <div className="absolute bottom-8 right-8 hidden text-6xl text-[#d6b76c]/60 md:block">𓂀</div>
    </section>
  );
}
