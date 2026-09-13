/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function CTASection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  // ✨ إعدادات الأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } }
  };

  return (
    <motion.section
      className="relative z-10 pb-24 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.div
        variants={staggerContainer}
        className="max-w-7xl mx-auto text-center"
      >
        <motion.h4
          variants={fadeUp}
          className={`about-p text-xl font-semibold mb-3 text-gradient`}  
        >
          {t("h6")}
        </motion.h4>

        <motion.p
          variants={fadeUp}
          className={`text-gradient mb-6`}
        >
          {t("p5")}
        </motion.p>

      <motion.a
  variants={fadeUp}
  href="/contact"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn-gradient w-full rounded-[4px] px-6 py-3 font-semibold tracking-wide shadow-lg cursor-pointer"
>
  {t("a")}
</motion.a>

      </motion.div>
    </motion.section>
  );
}
