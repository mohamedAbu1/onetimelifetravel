"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import Logo from "../header/components/Logo";

export default function HeritageSection() {
  const { t } = useTranslation("about");

  // ✨ إعدادات الأنيميشن
  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="relative z-10 pb-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        className="editorial-card mx-auto flex max-w-7xl flex-col items-center gap-8 rounded-3xl border p-8 md:flex-row"
      >
        {/* النص */}
        <motion.div variants={fadeLeft} className="flex-1">
          {/* اللوجو في الأعلى */}
          <div className="flex justify-center mb-6">
            <Logo compact />
          </div>

          <h3 className={`about-p text-2xl font-bold mb-3 text-gradient`}>
            {t("h5")}
          </h3>
          <DividerWithIcon />

          <p className={`text-center text-gradient`}>
            {t("p4")}
          </p>
        </motion.div>

        {/* الصورة */}
     
      </div>
    </motion.section>
  );
}
