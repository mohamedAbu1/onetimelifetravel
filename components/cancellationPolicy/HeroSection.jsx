"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation("cancellationPolicy");
  return <section className="policy-hero-modern relative isolate overflow-hidden border-b border-[#d1b06a]/20"><Image src="/HomePageImage/asdasdas.webp" alt={t("cancellationPolicy.altImage", { defaultValue: "Great Sphinx of Giza" })} fill priority className="-z-20 object-cover opacity-35" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#080808_12%,rgba(8,8,8,.82)_52%,rgba(8,8,8,.35)),linear-gradient(180deg,rgba(8,8,8,.35),#0d0d0d)]" /><div className="mx-auto flex min-h-[28rem] max-w-7xl items-end px-5 pb-14 pt-32 md:px-8 lg:px-12"><motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="max-w-3xl"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.34em] text-[#d1b06a]">OneTimeLifeTravel · Guest care</p><h1 className="font-[Cinzel] text-4xl font-semibold leading-tight text-[#f7edd5] md:text-6xl">{t("title")}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#c2b7a6]">Understand the steps, timelines, and options available when your travel plans change.</p></motion.div></div></section>;
}
