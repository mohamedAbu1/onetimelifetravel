"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaCarSide, FaCheck, FaRoute, FaShieldAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useTranslation as useCommonTranslation } from "react-i18next";

const benefits = ["Private door-to-door service", "Professional local drivers", "Comfort across Luxor & Aswan"];

export default function CarBookingSection() {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const { t: tc } = useCommonTranslation("common");

  return (
    <section className="car-transfer-section site-section relative w-full self-stretch overflow-hidden px-4 sm:px-6 lg:px-10" aria-labelledby="car-transfer-title">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute left-[8%] top-20 h-64 w-64 rounded-full bg-[var(--logo-border)]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[6%] h-80 w-80 rounded-full bg-[#6a4520]/20 blur-3xl" />
      </div>
      <div className="car-transfer-shell relative z-10 mx-auto grid max-w-7xl items-stretch gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }} className="car-transfer-copy order-2 flex flex-col justify-center lg:order-1">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--logo-border)]"><span className="h-px w-10 bg-[var(--logo-border)]" />{tc("signatureMobility")}</p>
          <h2 id="car-transfer-title" className="max-w-xl font-[Cinzel] text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--heading)] sm:text-5xl">{t("PremiumCarTransfer")}</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--sub-text)] sm:text-lg">{t("Experience")}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {benefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm text-[var(--text)]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--logo-border)]/50 text-[var(--logo-border)]"><FaCheck size={11} /></span>{benefit}</div>)}
          </div>
          {user ? <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => window.dispatchEvent(new CustomEvent("openCarBookingChat"))} className="editorial-button dust-interactive mt-9 inline-flex w-fit items-center gap-3 bg-[var(--logo-border)] px-7 py-3.5 text-sm text-[#15120e]"><FaCarSide />{t("Book")}<FaArrowRight className="text-xs" /></motion.button> : <p className="mt-9 text-sm font-semibold italic text-[var(--sub-text)]">{tc("loginToBookCar")}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }} className="order-1 lg:order-2">
          <div className="car-transfer-card editorial-card relative h-full overflow-hidden rounded-[2rem] border p-2.5 sm:p-3">
            <div className="absolute inset-0 bg-[url('/HomePageImage/magnific__egyptian-temple-background-with-montu-travel-carve__61911.webp')] bg-cover bg-center opacity-25 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/45 to-[#7e5b2b]/30" />
            <div className="relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[1.55rem] border border-[var(--logo-border)]/35 px-5 pb-5 pt-5 sm:min-h-[480px] sm:px-8">
              <div className="flex items-center justify-between text-[var(--logo-border)]"><span className="text-xs font-bold uppercase tracking-[0.28em]">OTL / 01</span><FaCarSide className="text-2xl" /></div>
              <Image src="/HomePageImage/car-png-39057.png" alt="Private Egypt tour car transfer" width={900} height={520} className="relative z-10 mx-auto w-full max-w-[620px] object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.7)]" />
              <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--logo-border)]/30 pt-4"><div><span className="block font-[Cinzel] text-xl text-[var(--heading)]">{tc("travelComfort")}</span><span className="mt-1 flex items-center gap-2 text-xs text-[var(--sub-text)]"><FaRoute className="text-[var(--logo-border)]" /> {tc("doorToDoor")}</span></div><span className="flex items-center gap-2 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sub-text)]"><FaShieldAlt className="text-[var(--logo-border)]" />{tc("trustedService")}</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
